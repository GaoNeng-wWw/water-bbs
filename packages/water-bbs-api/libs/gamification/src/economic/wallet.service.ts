import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionDetail,
  TransactionStatus,
  Wallet,
  WalletId,
} from './wallet.entity';
import { err, ok } from 'neverthrow';
import { InsufficientBalance, WalletNotFound } from './error';

@Injectable()
export class WalletService {
  constructor(private readonly em: EntityManager) {}
  async transfer(detail: TransactionDetail) {
    return this.em
      .transactional(async (em) => {
        const res = await em.execute(
          `UPDATE wallet SET balance_snapshot = balance_snapshot - ? WHERE id = ? AND balance_snapshot >= ?`,
          [detail.amount, detail.from, detail.amount],
          'run',
        );
        if (
          (Array.isArray(res)
            ? (res[1] as unknown as number)
            : (res as number)) === 0
        ) {
          throw new InsufficientBalance();
        }
        await em.execute(
          `UPDATE wallet SET balance_snapshot = balance_snapshot + ? WHERE id = ?`,
          [detail.amount, detail.to],
        );
        em.persist(em.create(Transaction, { ...detail }));
      })
      .then(() => {
        return ok(true);
      })
      .catch((reason) => {
        return err(reason);
      });
  }
  getWallet(id: WalletId) {
    return this.em
      .findOneOrFail(Wallet, { id })
      .then((wallet) => ok(wallet))
      .catch((reason) => {
        return err(new WalletNotFound(reason));
      });
  }
  async getBalance(id: WalletId) {
    const walletResult = await this.em
      .findOneOrFail(Wallet, { id })
      .then((wallet) => ok(wallet))
      .catch((reason) => {
        return err(new WalletNotFound(reason));
      });
    if (walletResult.isErr()) {
      return walletResult;
    }
    const wallet = walletResult.value;
    return ok(wallet.balanceSnapshot);
  }
  async rebuild(id: WalletId) {
    const walletResult = await this.em
      .findOneOrFail(Wallet, { id })
      .then((wallet) => ok(wallet))
      .catch((reason) => err(new WalletNotFound(reason)));
    if (walletResult.isErr()) {
      return walletResult;
    }
    const wallet = walletResult.value;
    await this.em.transactional(async (em) => {
      const result = await em.execute(
        `
    SELECT
      COALESCE(
        SUM(
          CASE
            WHEN "from" = ? THEN -amount
            WHEN "to" = ? THEN amount
            ELSE 0
          END
        ),
        0
      ) AS balance
    FROM transaction
    WHERE "from" = ? OR "to" = ? and status = ?
    `,
        [id, id, id, id, TransactionStatus.Success],
        'get',
      );
      const balance = BigInt(result[0].balance);
      wallet.balanceSnapshot = balance.toString();
      em.persist(wallet);
    });
    return ok(wallet);
  }
}
