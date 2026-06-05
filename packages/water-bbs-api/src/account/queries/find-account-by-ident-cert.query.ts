import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { IdentEnum } from 'water-bbs-migration';
import { DomainError, err, isErr, ok, Result } from 'water-bbs-shared';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../domain/repo/account.repo';
import { AccountNotFound } from '../application/errors';

export type FindAccountByIdIdentCertQueryResult = {
  accountId: string;
};

export class FindAccountByIdIdentCertQuery extends Query<
  Result<FindAccountByIdIdentCertQueryResult, DomainError>
> {
  constructor(
    public readonly ident_type: IdentEnum,
    public readonly ident_value: string,
    public readonly cert_value: string,
  ) {
    super();
  }
}

@QueryHandler(FindAccountByIdIdentCertQuery)
export class FindAccountByIdIdentCertQueryHandler implements IQueryHandler<FindAccountByIdIdentCertQuery> {
  constructor(
    @InjectAccountRepository()
    private repository: IAccountRepoistory,
  ) {}
  async execute(
    query: FindAccountByIdIdentCertQuery,
  ): Promise<Result<FindAccountByIdIdentCertQueryResult, DomainError>> {
    const accountRes = await this.repository.findByIdentValue(
      query.ident_type,
      query.ident_value,
    );
    if (isErr(accountRes)) {
      return accountRes;
    }
    const account = accountRes.value;
    if (!account) {
      return err(new AccountNotFound());
    }
    return ok({ accountId: account.id });
  }
}
