import { AccountID } from 'src/account/domain';
import { Account, IdentEnum } from 'water-bbs-migration';
import { err, ok, PersistenceError, Result } from 'water-bbs-shared';
import { IAccountRepoistory } from '../../domain/repo/account.repo';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@nestjs-redisx/core';

@Injectable()
export class AccountRepo implements IAccountRepoistory {
  constructor(
    private readonly em: EntityManager,
    private redis: RedisService,
  ) {}
  async upsert(account: Account): Promise<Result<boolean, PersistenceError>> {
    const em = this.em.fork();
    try {
      await em.begin();

      // 预加载所有需要操作的关联
      const existingAccount = await em.findOne(
        Account,
        { id: account.id },
        { populate: ['idents', 'certs', 'profile', 'role'] },
      );

      if (!existingAccount) {
        em.persist(account);
      } else {
        if (account.profile) {
          if (account.profile.name) {
            existingAccount.profile.name = account.profile.name;
          }
          if (account.profile.bio) {
            existingAccount.profile.bio = account.profile.bio;
          }
          if (account.profile.avatar) {
            existingAccount.profile.avatar = account.profile.avatar;
          }
        }
        if (account.role) {
          existingAccount.role = account.role;
        }
        em.persist(existingAccount);
      }

      await em.flush();
      await em.commit();
      return ok(true);
    } catch (reason) {
      await em.rollback();
      return err(new PersistenceError(reason as Error, { reason }));
    }
  }

  findByIdentValue(
    ident_type: IdentEnum,
    ident_value: string,
  ): Promise<Result<Account | null, PersistenceError>> {
    return this.em
      .findOne(
        Account,
        {
          idents: {
            identType: ident_type,
            identValue: ident_value,
          },
        },
        { populate: ['*'] },
      )
      .then((res) => {
        return ok(res);
      })
      .catch((reason) => err(new PersistenceError(null, { reason })));
  }

  findOne(
    account_id: AccountID,
  ): Promise<Result<Account | null, PersistenceError>> {
    return this.em
      .findOne(
        Account,
        { id: account_id.get('value') },
        { populate: ['profile', 'role', 'idents', 'certs'] },
      )
      .then(ok)
      .catch((reason) => {
        console.log(reason);
        return err(new PersistenceError(reason, { reason }));
      });
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
    return this.redis
      .get('CNT:ACCOUNT')
      .then((val) => ok(val ? Number(val) : 0))
      .catch((reason) => err(new PersistenceError(null, { reason })));
  }
  incr(): Promise<Result<boolean, PersistenceError>> {
    return this.redis
      .incr('CNT:ACCOUNT')
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(null, { reason })));
  }
  decr(): Promise<Result<boolean, PersistenceError>> {
    return this.redis
      .decr('CNT:ACCOUNT')
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(null, { reason })));
  }
}
