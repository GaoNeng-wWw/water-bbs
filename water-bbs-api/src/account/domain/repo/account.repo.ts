import { Result } from 'types-ddd';
import { Account } from '../ar/account';
import { PersistenceError } from '@app/shared';
import { AccountID } from '../vo';

export interface IAccountRepoistory {
  upsert(account: Account): Promise<Result<never, PersistenceError>>;
  findOne(
    account_id: AccountID,
  ): Promise<Result<Account | null, PersistenceError>>;
  findMany(
    account_id: AccountID,
    limit: number,
  ): Promise<Result<Account[], PersistenceError>>;
  count(): Promise<Result<number, PersistenceError>>;
  incr(): Promise<Result<never, PersistenceError>>;
  decr(): Promise<Result<never, PersistenceError>>;
}
