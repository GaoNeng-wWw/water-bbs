import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import {
  InjectAccountRepository,
  type IAccountRepoistory,
} from '../../domain/repo/account.repo';
import { isErr, ok, PersistenceError, Result } from 'water-bbs-shared';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { AccountID } from '../../domain';
export class AccountAliveQuery extends Query<
  Result<
    | { alive: false; reason: 'ACCOUNT_REMOVED' }
    | { alive: false; reason: 'ACCOUNT_BANNED'; expiredAt: Date }
    | { alive: true; accountID: string },
    PersistenceError
  >
> {
  constructor(public readonly accountId: string) {
    super();
  }
}

export const enum NotActiveReason {
  ACCOUNT_REMOVED = 'ACCOUNT_REMOVED',
  ACCOUNT_BANNED = 'ACCOUNT_BANNED',
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
    const accountRes = await this.repository.findOne(
      new AccountID({ value: query.accountId }),
    );
    if (isErr(accountRes)) {
      return accountRes;
    }
    const account = accountRes.value;
    if (!account || account.removedAt) {
      return ok({
        alive: false,
        reason: NotActiveReason.ACCOUNT_REMOVED,
      } as const);
    }

    if (await this.redis.exists(`ban:${account.id}`)) {
      const exp = Number(
        (await this.redis.hget(`ban:${account.id}`, 'expiredAt')) ?? 0,
      );
      return ok({
        alive: false as const,
        reason: NotActiveReason.ACCOUNT_BANNED,
        expiredAt: new Date(exp),
      } as const);
    }

    return ok({
      alive: true,
      accountID: account.id,
    } as const);
  }
}
