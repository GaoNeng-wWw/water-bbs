import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, isErr, isNone, ok, Result } from 'water-bbs-shared';
import { PersistenceError } from 'water-bbs-shared';
import type { ISessionRepo } from '../domain/session.repo';

export class TokenAliveQuery extends Query<Result<boolean, PersistenceError>> {
  constructor(
    public readonly sid: string,
    public readonly tokenID: string,
  ) {
    super();
  }
}

@QueryHandler(TokenAliveQuery)
export class TokenAliveHandler implements IQueryHandler<TokenAliveQuery> {
  constructor(private repo: ISessionRepo) {}
  async execute(
    query: TokenAliveQuery,
  ): Promise<Result<boolean, PersistenceError>> {
    const findSessionResult = await this.repo.findAuthSessionBySessionID(
      query.sid,
    );
    if (isErr(findSessionResult)) {
      return err(findSessionResult.error);
    }
    const maybeSession = findSessionResult.value;
    if (isNone(maybeSession)) {
      return ok(false);
    }
    const session = maybeSession.value;
    const tokenPair = session.findToken(query.tokenID);
    if (!tokenPair) {
      return ok(false);
    }
    return ok(tokenPair.createdAt + tokenPair.ttl > Date.now());
  }
}
