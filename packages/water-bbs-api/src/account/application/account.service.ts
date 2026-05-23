import { Injectable } from '@nestjs/common';
import {
  CreateAccountDTO,
  CreateAccountResponse,
} from './dto/create-account.dto';
import { Account, IdentEnum, Profile } from 'water-bbs-migration';
import { AccountID, AccountRegistor, InjectAccountRegistor } from '../domain';
import {
  err,
  isErr,
  isOk,
  ok,
  pipeResult,
  unwrapErr,
  unwrapResult,
} from 'water-bbs-shared';
import { UnsupportedIdentType } from './errors/unsupported-ident-type';
import type { IRegisterPolicy } from '@app/shared';
import { InjectRegisterPolicy } from '@app/shared';
import { Result } from 'water-bbs-shared';
import { ApplicationServiceError } from 'water-bbs-shared';
import {
  type IInviteCode,
  InjectInviteCodeRepository,
} from '../domain/repo/invite-code.repo';
import { RequireInviteCode, RequrieCaptcha } from './errors';
import { InvalidInviteCode } from './errors/invalid-invite-code';
import { CaptchaService } from '@app/captcha/captcha.service';
import { Channel } from '@app/captcha/domain';
import { InvalidCaptcha } from './errors/invalid-captcha';
import {
  InjectAccountRepository,
  type IAccountRepoistory,
} from '../domain/repo/account.repo';
import { AccountNotFound } from './errors/account-not-found';
import {
  UpdateProfileDTO,
  UpdateProfileResponse,
} from './dto/update-profile.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { InvalidMfa } from './errors/invalid-mfa';
import {
  RemoveAccountDTO,
  RemoveAccountResponse,
} from './dto/remove-account.dto';
import { PublicAccountInfo } from './dto/public-account-info';
import { GetProfileDTO } from './dto/get-profile.dto';
import { UpdatePassword } from './dto/update-password.dto';
import { CommandBus } from '@nestjs/cqrs';
import {
  AccountRemovedCommand,
  AccountResetPasswordCommand,
  AccountUpdatedPasswordCommand,
} from '../domain/command';
import {
  InjectStoreEngine,
  InjectUrlResolver,
  UnlinkFileReference,
  type Resolver,
  type StorageEngine,
} from '@app/storage';
import { UpdateAvatarResponse } from '../dto/update-avatar.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectAccountRegistor()
    private registor: AccountRegistor[],
    @InjectRegisterPolicy()
    private policy: IRegisterPolicy,
    @InjectInviteCodeRepository()
    private codeStore: IInviteCode,
    private captcha: CaptchaService,
    @InjectAccountRepository()
    private accountRepository: IAccountRepoistory,
    private readonly commandPublisher: CommandBus,
    @InjectUrlResolver()
    private readonly fileUrlResolver: Resolver,
    @InjectStoreEngine()
    private readonly storage: StorageEngine,
  ) {}

  async createAccount(
    dto: CreateAccountDTO,
  ): Promise<Result<CreateAccountResponse, ApplicationServiceError>> {
    const account = new Account();
    const profile = new Profile(account, dto.username);
    const registor = this.registor.find((r) => r.valid(dto.ident_type));
    if (!registor) {
      return err(new UnsupportedIdentType(dto.ident_type));
    }
    const requireInviteCode = await this.policy.requireInviteCode();
    if (isErr(requireInviteCode)) {
      return requireInviteCode;
    }
    if (unwrapResult(requireInviteCode)) {
      if (!dto.invite_code) {
        return err(new RequireInviteCode());
      }
      const handle = await this.codeStore.exists(dto.invite_code);
      if (isErr(handle)) {
        return handle;
      }
      const status = unwrapResult(handle);
      if (!status) {
        return err(new InvalidInviteCode());
      }
    }

    const requireCaptcha = await this.policy.requireCaptcha();
    if (isErr(requireCaptcha)) {
      return requireCaptcha;
    }
    if (unwrapResult(requireCaptcha)) {
      if (!dto.captcha) {
        return err(new RequrieCaptcha());
      }
      const handle = await this.captcha.verify(
        dto.captcha,
        dto.ident_value,
        Channel.Email,
      );
      if (isErr(handle)) {
        return handle;
      }
      const status = unwrapResult(handle);
      if (!status) {
        return err(new InvalidCaptcha());
      }
    }

    const res = await registor.execute({ ...dto, profile, account });
    if (isErr(res)) {
      return res;
    }
    const incrHandle = await this.accountRepository.incr();
    if (isErr(incrHandle)) {
      return err(incrHandle.error);
    }
    return ok(new CreateAccountResponse(account.id));
  }

  async removeAccount(
    dto: RemoveAccountDTO,
  ): Promise<Result<RemoveAccountResponse, ApplicationServiceError>> {
    const accountId = new AccountID({ value: dto.id });
    const res = await this.accountRepository.findOne(accountId);
    if (isErr(res)) {
      return err(unwrapErr(res));
    }
    const account = res.value;
    if (!account) {
      return err(new AccountNotFound());
    }
    const removeHandle = account.remove();
    if (isErr(removeHandle)) {
      return removeHandle;
    }
    const updateResult = await this.accountRepository.upsert(account);
    if (isErr(updateResult)) {
      return updateResult;
    }
    const decrHandle = await this.accountRepository.decr();
    if (isErr(decrHandle)) {
      return err(decrHandle.error);
    }
    await this.commandPublisher.execute(
      new AccountRemovedCommand(accountId.get('value')),
    );
    return ok(new RemoveAccountResponse(account.id));
  }

  async updateProfile(id: string, dto: UpdateProfileDTO) {
    const accountId = new AccountID({ value: id });
    const res = await this.accountRepository.findOne(accountId);
    if (isErr(res)) {
      return err(unwrapErr(res));
    }
    const account = res.value;
    if (!account) {
      return err(new AccountNotFound());
    }
    if (dto.username) {
      account.profile.name = dto.username;
    }
    if (dto.bio) {
      account.profile.bio = dto.bio;
    }
    const updateResult = await this.accountRepository.upsert(account);
    if (isErr(updateResult)) {
      return updateResult;
    }
    return ok(
      new UpdateProfileResponse(
        account.id,
        account.profile.name,
        account.profile.bio,
      ),
    );
  }

  async updatePassword(dto: UpdatePassword) {
    const accountRes = await this.accountRepository.findOne(dto.accountID);
    if (isErr(accountRes)) {
      return accountRes;
    }
    const account = accountRes.value;
    if (!account) {
      return err(new AccountNotFound());
    }

    const mfaResult = pipeResult(
      // TODO: 后面可能兼容更多的Channel，这里先写Email
      await this.captcha.verify(dto.mfaCode, account.id, Channel.Email),
    );
    if (mfaResult.isErr()) {
      return err(mfaResult.unwrapErr());
    }
    const mfaStatus = mfaResult.unwrap();
    if (!mfaStatus) {
      return err(new InvalidMfa());
    }

    const resetPasswordRes = account.resetPassword(dto.password);
    if (isErr(resetPasswordRes)) {
      return resetPasswordRes;
    }
    const updateResult = pipeResult(
      await this.accountRepository.upsert(account),
    );
    if (updateResult.isErr()) {
      return updateResult;
    }
    await this.commandPublisher.execute(
      new AccountUpdatedPasswordCommand(account.id),
    );
    return ok(true);
  }

  async resetPassword(dto: ResetPasswordDTO) {
    const account = pipeResult(
      await this.accountRepository.findByIdentValue(
        IdentEnum.EMAIL,
        dto.ident_value,
      ),
    );

    if (account.isErr()) {
      return err(account.unwrapErr());
    }
    const accountRes = account.unwrap();
    if (!accountRes) {
      return err(new AccountNotFound());
    }
    if (!dto.force) {
      const mfaResult = pipeResult(
        await this.captcha.verify(dto.mfa_code, accountRes.id, Channel.Email),
      );
      if (mfaResult.isErr()) {
        return err(mfaResult.unwrapErr());
      }
      const mfaStatus = mfaResult.unwrap();
      if (!mfaStatus) {
        return err(new InvalidMfa());
      }
    }

    accountRes.resetPassword(dto.password);

    const updateResult = pipeResult(
      await this.accountRepository.upsert(accountRes),
    );
    if (updateResult.isErr()) {
      return updateResult;
    }
    await this.commandPublisher.execute(
      new AccountResetPasswordCommand(accountRes.id),
    );
    return ok(true);
  }

  async findAccount(id: string) {
    const accountId = new AccountID({ value: id });
    const res = pipeResult(await this.accountRepository.findOne(accountId));
    if (res.isErr()) {
      return err(unwrapErr(res));
    }
    const account = res.unwrap();
    if (!account) {
      return err(new AccountNotFound());
    }
    return ok(
      new PublicAccountInfo(
        account.id,
        account.profile.name,
        account.profile.bio,
      ),
    );
  }

  async getProfile(id: string) {
    const accountId = new AccountID({ value: id });
    const res = await this.accountRepository.findOne(accountId);
    if (isErr(res)) {
      return res;
    }
    const account = res.value;
    if (!account) {
      return err(new AccountNotFound());
    }
    const profile = account.profile;
    const avatarUrl = profile.avatar
      ? await this.fileUrlResolver.getUrl(profile.avatar)
      : ok('');
    return ok(
      new GetProfileDTO(
        account.id,
        profile.name,
        profile.bio,
        isOk(avatarUrl) ? avatarUrl.value : '',
      ),
    );
  }
  async uploadAvatar(accountId: string, avatar: Express.Multer.File) {
    const accountRes = await this.accountRepository.findOne(
      new AccountID({ value: accountId }),
    );
    if (isErr(accountRes)) {
      return accountRes;
    }
    const account = accountRes.value;
    if (!account) {
      return err(new AccountNotFound());
    }
    const putResult = await this.storage.put(
      avatar.buffer,
      avatar.mimetype,
      avatar.originalname || avatar.filename,
      avatar.size,
    );
    if (isErr(putResult)) {
      return putResult;
    }
    const fileRef = putResult.value;
    if (account.profile.avatar) {
      await this.commandPublisher.execute(
        new UnlinkFileReference(account.profile.avatar),
      );
    }
    account.profile.avatar = fileRef;
    await this.accountRepository.upsert(account);
    const urlResult = await this.fileUrlResolver.getUrl(account.profile.avatar);
    if (isErr(urlResult)) {
      return urlResult;
    }
    return new UpdateAvatarResponse(urlResult.value);
  }
}
