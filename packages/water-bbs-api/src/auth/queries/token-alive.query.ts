import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { isErr, ok, Result } from 'water-bbs-shared';
import { PersistenceError } from 'water-bbs-shared';
import { InjectSessionRepo, type ISessionRepo } from '../domain/session.repo';

export class TokenAliveQuery extends Query<Result<boolean, PersistenceError>> {
  constructor(
    public readonly accountId: string,
    public readonly tokenId: string,
  ) {
    super();
  }
}

@QueryHandler(TokenAliveQuery)
export class TokenAliveHandler implements IQueryHandler<TokenAliveQuery> {
  constructor(
    @InjectSessionRepo()
    private repo: ISessionRepo,
  ) {}
  async execute(
    query: TokenAliveQuery,
  ): Promise<Result<boolean, PersistenceError>> {
    const tokenAlive = await this.repo.tokenAlive(
      query.accountId,
      query.tokenId,
    );
    if (isErr(tokenAlive)) {
      return tokenAlive;
    }
    return ok(tokenAlive.value);
  }
}
