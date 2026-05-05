import { AccountID } from 'src/account/domain';
import { Account } from 'water-bbs-migration';
import { err, ok, PersistenceError, Result } from 'water-bbs-shared';
import { IAccountRepoistory } from '../../domain/repo/account.repo';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-redisx/core';
import Redis from 'ioredis';

@Injectable()
export class AccountRepo implements IAccountRepoistory {
  constructor(
    private readonly em: EntityManager,
    @InjectRedis()
    private redis: Redis,
  ) {}
  upsert(account: Account): Promise<Result<boolean, PersistenceError>> {
    return this.em
      .persist(account)
      .flush()
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(null, { reason })));
  }
  findOne(
    account_id: AccountID,
  ): Promise<Result<Account | null, PersistenceError>> {
    return this.em
      .findOne(
        Account,
        { removedAt: null, id: account_id.get('value') },
        { cache: true },
      )
      .then((res) => ok(res))
      .catch((reason) => err(new PersistenceError(null, { reason })));
  }
  findMany(
    account_id: AccountID,
    limit: number,
  ): Promise<Result<Account[], PersistenceError>> {
    return this.em
      .find(
        Account,
        {
          id: {
            $gte: account_id.get('value'),
          },
        },
        {
          limit,
          populate: ['*'],
        },
      )
      .then((account) => ok(account))
      .catch((reason) => err(new PersistenceError(null, { reason })));
  }
  count(): Promise<Result<number, PersistenceError>> {
    throw '';
    // return this.redis
    //   .get('CNT:ACCOUNT')
    //   .then((val) => ok(val ? Number(val) : 0))
    //   .catch((reason) => err(new PersistenceError(null, { reason })));
  }
  incr(): Promise<Result<boolean, PersistenceError>> {
    throw '';
    return this.redis
      .incr('CNT:ACCOUNT')
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(null, { reason })));
  }
  decr(): Promise<Result<boolean, PersistenceError>> {
    throw '';
    return this.redis
      .decr('CNT:ACCOUNT')
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(null, { reason })));
  }
}
