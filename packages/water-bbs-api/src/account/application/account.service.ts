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

    const res = await registor.execute({ ...dto, profile });
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
    const res = pipeResult(await this.accountRepository.findOne(accountId));
    if (res.isErr()) {
      return err(unwrapErr(res));
    }
    const account = res.unwrap();
    if (!account) {
      return err(new AccountNotFound());
    }
    const removeHandle = pipeResult(account.remove());
    if (removeHandle.isErr()) {
      return err(unwrapErr(removeHandle));
    }
    const updateResult = pipeResult(
      await this.accountRepository.upsert(account),
    );
    if (updateResult.isErr()) {
      return updateResult;
    }
    const decrHandle = await this.accountRepository.decr();
    if (isErr(decrHandle)) {
      return err(decrHandle.error);
    }
    return ok(new RemoveAccountResponse(account.id));
  }

  async updateProfile(id: string, dto: UpdateProfileDTO) {
    const accountId = new AccountID({ value: id });
    const res = pipeResult(await this.accountRepository.findOne(accountId));
    if (res.isErr()) {
      return err(unwrapErr(res));
    }
    const account = res.unwrap();
    if (!account) {
      return err(new AccountNotFound());
    }
    if (dto.username) {
      account.profile.name = dto.username;
    }
    if (dto.bio) {
      account.profile.bio = dto.bio;
    }
    const updateResult = pipeResult(
      await this.accountRepository.upsert(account),
    );
    if (updateResult.isErr()) {
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

  async resetPassword(dto: ResetPasswordDTO) {
    const account = pipeResult(
      await this.accountRepository.findByIdentValue(
        dto.ident_value,
        IdentEnum.EMAIL,
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
    const res = pipeResult(await this.accountRepository.findOne(accountId));
    if (res.isErr()) {
      return err(unwrapErr(res));
    }
    const account = res.unwrap();
    if (!account) {
      return err(new AccountNotFound());
    }
    const profile = account.profile;
    return ok(
      new GetProfileDTO(account.id, profile.name, profile.bio, profile.avatar),
    );
  }
}
