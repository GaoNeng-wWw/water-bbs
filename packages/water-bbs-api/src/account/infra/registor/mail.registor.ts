import { Injectable } from '@nestjs/common';
import {
  AccountRegistor,
  RegistorProp,
} from '../../domain/strategies/account-registor';
import {
  Result,
  DomainError,
  isErr,
  InfrastructureError,
  PersistenceError,
  err,
  ok,
} from 'water-bbs-shared';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../../domain/repo/account.repo';
import { Account, Cert, CertEnum, Ident, IdentEnum } from 'water-bbs-migration';

@Injectable()
export class MailRegistor implements AccountRegistor {
  constructor(
    @InjectAccountRepository() private readonly repo: IAccountRepoistory,
  ) {}
  valid(ident_type: string): boolean {
    return (
      ident_type.toLowerCase() === 'email' ||
      ident_type.toLowerCase() === 'mail'
    );
  }
  async execute(prop: RegistorProp): Promise<Result<boolean, DomainError>> {
    const acc = new Account();
    acc.profile = prop.profile;
    const ident = new Ident({
      identType: IdentEnum.EMAIL,
      identValue: prop.ident_value,
      verified: false,
    });
    const cert = new Cert({
      certType: CertEnum.PASSWORD,
      certValue: prop.cert_value,
    });
    const addCertResult = acc.addCert(cert);
    if (isErr(addCertResult)) {
      return addCertResult;
    }
    const addIdentityResult = acc.addIdentity(ident);
    if (isErr(addIdentityResult)) {
      return addIdentityResult;
    }
    return this.repo
      .upsert(acc)
      .then((val) => (isErr(val) ? val : ok(true)))
      .catch((reason) =>
        err(new InfrastructureError(null, new PersistenceError(reason), {})),
      );
  }
}
