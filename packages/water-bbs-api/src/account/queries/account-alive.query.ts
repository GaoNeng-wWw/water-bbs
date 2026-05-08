import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import type { IAccountRepoistory } from '../domain/repo/account.repo';
import { IdentEnum } from 'water-bbs-migration';
import { isErr, ok, PersistenceError, Result } from 'water-bbs-shared';
export class AccountAliveQuery extends Query<
  Result<
    { alive: false } | { alive: true; accountID: string },
    PersistenceError
  >
> {
  constructor(
    public readonly ident_type: IdentEnum,
    public readonly ident_value: string,
    public readonly cert_value: string,
  ) {
    super();
  }
}

@QueryHandler(AccountAliveQuery)
export class AccountAliveHandler implements IQueryHandler<AccountAliveQuery> {
  constructor(private repository: IAccountRepoistory) {}

  async execute(query: AccountAliveQuery) {
    const accountRes = await this.repository.findByIdentValue(
      IdentEnum.EMAIL,
      query.ident_type,
    );
    if (isErr(accountRes)) {
      return accountRes;
    }
    const account = accountRes.value;
    if (!account || account.removedAt) {
      return ok({ alive: false } as const);
    }
    return ok({
      alive: true,
      accountID: account.id,
    });
  }
}
