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

export class TransactionFromSystemCommand extends Command<
  Result<null, DomainError>
> {
  constructor(
    public target: string,
    public cost: number,
    public detail: TransactionDetail,
  ) {
    super();
  }
}

@CommandHandler(TransactionFromSystemCommand)
export class TransactionFromSystemHandler implements ICommandHandler<TransactionFromSystemCommand> {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: EntityRepository<Wallet>,
    private readonly em: EntityManager,
  ) {}

  async execute(
    command: TransactionFromSystemCommand,
  ): Promise<Result<null, DomainError>> {
    const { target, cost, detail } = command;
    const fromWallet = await this.walletRepo.findOne({ accountId: target });
    if (!fromWallet) {
      return err(new DomainError(`WALL_NOT_FOUND`, null));
    }
    return this.em.transactional(async (em) => {
      const sourceRes = await em.getConnection().execute(
        `UPDATE wallet 
       SET balance = CAST(balance AS DECIMAL(18,2)) + CAST(? AS DECIMAL(18,2)),
           version = version + 1
       WHERE account_id = ?`,
        [cost, target, cost], 'run'
      );
      console.log(sourceRes);
      if (sourceRes.length === 0) {
        return err(new DomainError('INSUFFICIENT_BALANCE'));
      }
      const log = TransferLog.create(
        `${cost}`,
        detail,
        new Subject(true),
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
