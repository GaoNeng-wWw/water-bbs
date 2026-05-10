import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import {
  InjectAccountRepository,
  type IAccountRepoistory,
} from '../domain/repo/account.repo';
import { CertEnum } from 'water-bbs-migration';
import { isErr, ok, PersistenceError, Result } from 'water-bbs-shared';
import { AccountID } from '../domain';
export class CheckPasswordQuery extends Query<
  Result<{ valid: boolean }, PersistenceError>
> {
  constructor(
    public readonly accountID: string,
    public readonly certValue: string,
  ) {
    super();
  }
}

@QueryHandler(CheckPasswordQuery)
export class CheckPasswordHandler implements IQueryHandler<CheckPasswordQuery> {
  constructor(
    @InjectAccountRepository()
    private repository: IAccountRepoistory,
  ) {}

  async execute(query: CheckPasswordQuery) {
    const accountRes = await this.repository.findOne(
      new AccountID({ value: query.accountID }),
    );
    if (isErr(accountRes)) {
      return accountRes;
    }
    const account = accountRes.value;
    if (!account || account.removedAt) {
      return ok({ valid: false });
    }
    const cert = account.findCert(CertEnum.PASSWORD);
    return ok({
      valid: cert.comparePassword(query.certValue),
    });
  }
}
