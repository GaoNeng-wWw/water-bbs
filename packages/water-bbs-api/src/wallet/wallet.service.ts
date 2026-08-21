import {
  Transaction,
  TransactionStatus,
  Wallet,
  WalletId,
  WalletNotFound,
} from '@app/gamification/economic';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { err, ok } from 'neverthrow';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: EntityRepository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepo: EntityRepository<Wallet>,
  ) {}
  async getBalance(walletId: WalletId) {
    const wallet = await this.walletRepo.findOne({
      id: walletId,
    });
    if (!wallet) {
      return err(new WalletNotFound());
    }

    return ok({
      balance: wallet.balanceSnapshot.toString(),
    });
  }
  listTransactions(walletId: WalletId, cursor?: string, limit: number = 100) {
    return this.transactionRepo
      .findByCursor({
        where: {
          $or: [{ from: walletId }, { to: walletId }],
          status: TransactionStatus.Success,
        },
        orderBy: {
          id: 'asc',
        },
        first: limit,
        after: cursor,
      })
      .then((cursor) => {
        return {
          items: cursor.items,
          nextCursor: cursor.endCursor,
        };
      });
  }
}
