import { MetaEntity } from '@app/shared';
import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import type { AccountId } from '../../../../src/auth';
import { v7, MAX } from 'uuid';
import { Collection } from '@mikro-orm/core';

export type TransactionId = string & { readonly __brand: unique symbol };
export type WalletId = AccountId;
export const SYSTEM_WALLET_ID = MAX as WalletId;
export const createTransactionId = (): TransactionId => v7() as TransactionId;

@Entity({ tableName: 'wallet' })
export class Wallet extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: WalletId;
  @Property({ type: 'bigint' })
  balanceSnapshot: string;
  transactions = new Collection<Transaction>(this, []);
  addTransaction(detail: TransactionDetail): void {
    const tx = new Transaction();
    tx.id = createTransactionId();
    tx.from = detail.from;
    tx.to = detail.to;
    tx.amount = detail.amount;
    this.transactions.add(tx);
  }
}

export enum TransactionStatus {
  Success = 'success',
  Pending = 'pending',
  Fail = 'fail',
}

@Entity({ tableName: 'transaction' })
export class Transaction {
  @PrimaryKey({ type: 'uuid' })
  id: TransactionId = createTransactionId();

  @Index()
  @Property({ type: 'uuid' })
  from: WalletId;

  @Index()
  @Property({ type: 'uuid' })
  to: WalletId;

  @Property({ type: 'bigint' })
  amount: string;

  @Index()
  @Enum(() => TransactionStatus)
  status: TransactionStatus;

  @Property({ type: 'text' })
  detail: string;
}

export interface TransactionDetail {
  from: WalletId;
  to: WalletId;
  amount: string;
  status: TransactionStatus;
  detail: string;
}
