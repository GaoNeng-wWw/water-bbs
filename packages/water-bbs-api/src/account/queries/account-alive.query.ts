import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import {
  InjectAccountRepository,
  type IAccountRepoistory,
} from '../domain/repo/account.repo';
import { IdentEnum } from 'water-bbs-migration';
import { isErr, ok, PersistenceError, Result } from 'water-bbs-shared';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
export class AccountAliveQuery extends Query<
  Result<
    | { alive: false; reason: 'ACCOUNT_REMOVED' }
    | { alive: false; reason: 'ACCOUNT_BANNED'; expiredAt: Date }
    | { alive: true; accountID: string },
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
  private readonly redis: Redis;
  constructor(
    @InjectAccountRepository()
    private repository: IAccountRepoistory,
    redisService: RedisService,
  ) {
    this.redis = redisService.getOrThrow();
  }

  async execute(query: AccountAliveQuery) {
    const accountRes = await this.repository.findByIdentValue(
      query.ident_type,
      query.ident_value,
    );
    if (isErr(accountRes)) {
      return accountRes;
    }
    const account = accountRes.value;
    if (!account || account.removedAt) {
      return ok({ alive: false, reason: 'ACCOUNT_REMOVED' } as const);
    }

    if (await this.redis.exists(`ban:${account.id}`)) {
      const exp = Number(
        (await this.redis.hget(`ban:${account.id}`, 'expiredAt')) ?? 0,
      );
      return ok({
        alive: false as const,
        reason: 'ACCOUNT_BANNED',
        expiredAt: new Date(exp),
      } as const);
    }

    return ok({
      alive: true,
      accountID: account.id,
    } as const);
  }
}
