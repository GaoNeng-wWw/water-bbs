import { Injectable } from '@nestjs/common';
import { CreateAccountDTO } from './dto/create-account.dto';
import { Account, Profile } from 'water-bbs-migration';
import { AccountRegistor, InjectAccountRegistor } from '../domain';
import { err, isErr, ok, unwrapResult } from 'water-bbs-shared';
import { UnsupportedIdentType } from './errors/unsupported-ident-type';
import type { IRegisterPolicy } from '@app/shared';
import { InjectRegisterPolicy } from '@app/shared';
import { Result } from 'water-bbs-shared';
import { ApplicationServiceError } from 'water-bbs-shared';
import {
  type IInviteCode,
  InjectInviteCodeRepository,
} from '../domain/repo/invite-code.repo';
import { RequireInviteCode } from './errors';
import { InvalidInviteCode } from './errors/invalid-invite-code';

@Injectable()
export class AccountService {
  constructor(
    @InjectAccountRegistor()
    private registor: AccountRegistor[],
    @InjectRegisterPolicy()
    private policy: IRegisterPolicy,
    @InjectInviteCodeRepository()
    private codeStore: IInviteCode,
  ) {}

  async createAccount(
    dto: CreateAccountDTO,
  ): Promise<Result<boolean, ApplicationServiceError>> {
    const account = new Account();
    const profile = new Profile(account, dto.username);
    const registor = this.registor.find((r) => r.valid(dto.ident_type));
    if (!registor) {
      return err(new UnsupportedIdentType(dto.ident_type));
    }
    const requireInviteCode = await this.policy.requireCaptcha();
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

    /*
    TODO:
      get features
        if enable-invite
          check invite-code
          if not valid invite-code
            throw application_error
        if enable_captcha
          check captcha-code
          if not valid captcha-code
            throw application_error
      run registor
    */
    const res = await registor.execute({ ...dto, profile });
    if (isErr(res)) {
      return res;
    }
    return ok(true);
  }
}
