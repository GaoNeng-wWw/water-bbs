import { PersistenceError } from '@app/shared';
import { Account, AccountID } from '../../domain';
import { Result } from 'types-ddd';
import { IAccountRepoistory } from '../../domain/repo/account.repo';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mysql';
import { AccountEntity, IdentEntity } from 'water-bbs-migration';

@Injectable()
export class AccountRepository implements IAccountRepoistory {
  constructor(private em: EntityManager) {}
  upsert(account: Account): Promise<Result<never, PersistenceError>> {
    const _account = account.toObject();
    const accountEntity = new AccountEntity();
    accountEntity.id = _account.id;
    accountEntity.certs = _account.certs;
    throw new Error('Method not implemented.');
  }
  findOne(
    account_id: AccountID,
  ): Promise<Result<Account | null, PersistenceError>> {
    throw new Error('Method not implemented.');
  }
  findMany(
    account_id: AccountID,
    limit: number,
  ): Promise<Result<Account[], PersistenceError>> {
    throw new Error('Method not implemented.');
  }
  count(): Promise<Result<number, PersistenceError>> {
    throw new Error('Method not implemented.');
  }
  incr(): Promise<Result<never, PersistenceError>> {
    throw new Error('Method not implemented.');
  }
  decr(): Promise<Result<never, PersistenceError>> {
    throw new Error('Method not implemented.');
  }
}
