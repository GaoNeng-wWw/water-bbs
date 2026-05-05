import { Injectable } from '@nestjs/common';
import { CreateAccountDTO } from './dto/create-account.dto';
import { Account, Profile } from 'water-bbs-migration';
import { AccountRegistor, InjectAccountRegistor } from '../domain';
import { err, isErr, ok } from 'water-bbs-shared';
import { UnsupportedIdentType } from './errors/unsupported-ident-type';

@Injectable()
export class AccountService {
  constructor(
    @InjectAccountRegistor()
    private registor: AccountRegistor[],
  ) {}

  async createAccount(dto: CreateAccountDTO) {
    const account = new Account();
    const profile = new Profile(account, dto.username);
    const registor = this.registor.find((r) => r.valid(dto.ident_type));
    if (!registor) {
      return err(new UnsupportedIdentType(dto.ident_type));
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
