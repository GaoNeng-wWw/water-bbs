import { Result } from 'water-bbs-shared';
import { PersistenceError } from 'water-bbs-shared';
import { Account } from 'water-bbs-migration';
import { AccountID } from '../vo';
import { Inject } from '@nestjs/common';

export const ACCOUNT_REPO_TOKEN = Symbol('ACCOUNT_REPOSITORY');
export const InjectAccountRepository = () => Inject(ACCOUNT_REPO_TOKEN);

export interface IAccountRepoistory {
  upsert(account: Account): Promise<Result<boolean, PersistenceError>>;
  findOne(
    account_id: AccountID,
  ): Promise<Result<Account | null, PersistenceError>>;
  findMany(
    account_id: AccountID,
    limit: number,
  ): Promise<Result<Account[], PersistenceError>>;
  count(): Promise<Result<number, PersistenceError>>;
  incr(): Promise<Result<boolean, PersistenceError>>;
  decr(): Promise<Result<boolean, PersistenceError>>;
}
