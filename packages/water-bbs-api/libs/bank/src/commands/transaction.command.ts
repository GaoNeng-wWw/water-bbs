import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Wallet, TransferLog, TransactionDetail } from 'water-bbs-migration';
import { Subject } from 'water-bbs-migration';
import {
  DomainError,
  err,
  ok,
  PersistenceError,
  Result,
} from 'water-bbs-shared';

export class TransactionCommand extends Command<Result<null, DomainError>> {
  constructor(
    public source: string,
    public target: string,
    public cost: number,
    public detail: TransactionDetail,
  ) {
    super();
  }
}

@CommandHandler(TransactionCommand)
export class TransactionHandler implements ICommandHandler<TransactionCommand> {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: EntityRepository<Wallet>,
    private readonly em: EntityManager,
  ) {}

  async execute(
    command: TransactionCommand,
  ): Promise<Result<null, DomainError>> {
    const { source, target, cost, detail } = command;
    const fromWallet = await this.walletRepo.findOne({ accountId: source });
    const targetWallet = await this.walletRepo.findOne({ accountId: target });
    if (!fromWallet || !targetWallet) {
      return err(
        new DomainError(`WALL_NOT_FOUND`, null, {
          type: 'target',
          accountId: target,
        }),
      );
    }
    return this.em.transactional(async (em) => {
      const sourceRes = await em.getConnection().execute(
        `UPDATE wallet 
       SET balance = CAST(balance AS DECIMAL(18,2)) - CAST(? AS DECIMAL(18,2)),
           version = version + 1
       WHERE account_id = ? 
         AND CAST(balance AS DECIMAL(18,2)) >= CAST(? AS DECIMAL(18,2))`,
        [cost, source, cost],
      );
      if (sourceRes.length === 0) {
        return err(new DomainError('INSUFFICIENT_BALANCE'));
      }

      const targetRes = await em.getConnection().execute(
        `UPDATE wallet 
       SET balance = CAST(balance AS DECIMAL(18,2)) + CAST(? AS DECIMAL(18,2)),
           version = version + 1
       WHERE account_id = ?`,
        [cost, target],
      );
      if (targetRes.length === 0) {
        return err(new DomainError('TARGET_WALLET_NOT_FOUND'));
      }

      const log = TransferLog.create(
        `cost`,
        detail,
        new Subject(false, source),
        new Subject(false, target),
      );
      em.persist(log);
      return em
        .flush()
        .then(() => ok(null))
        .catch((reason) => {
          const perr = new PersistenceError(reason);
          return err(new DomainError(perr.message, perr));
        });
    });
  }
}
