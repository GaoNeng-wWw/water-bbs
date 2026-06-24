import { IQueryHandler, Query } from '@nestjs/cqrs';
import {
  DomainError,
  err,
  ok,
  PersistenceError,
  Result,
} from 'water-bbs-shared';
import {
  TransactionItem,
  TransactionSubject,
} from '../dto/get-transaction-list.dto';
import { EntityRepository } from '@mikro-orm/mysql';
import { Subject, TransferLog } from 'water-bbs-migration';

export enum Direction {
  IN,
  OUT,
  BOTH,
}

export class GetTransactionLogListQuery extends Query<
  Result<TransactionItem[], DomainError>
> {
  constructor(
    public readonly year: number,
    public readonly accountId: string,
    public readonly size: number = 100,
    public readonly direction: Direction = Direction.BOTH,
  ) {
    super();
  }
}

export class GetTransactionLogList implements IQueryHandler<GetTransactionLogListQuery> {
  constructor(private readonly repo: EntityRepository<TransferLog>) {}
  async execute({
    year,
    accountId,
    size,
    direction,
  }: GetTransactionLogListQuery): Promise<
    Result<TransactionItem[], DomainError>
  > {
    const startAt = new Date(year, 0, 1);
    const endAt = new Date(year, 11, 31, 23, 59, 59, 999);
    const qb = this.repo.createQueryBuilder('qb');
    qb.limit(size);
    if (direction === Direction.IN) {
      qb.where({ to: new Subject(false, accountId) });
    }
    if (direction === Direction.OUT) {
      qb.where({ from: new Subject(false, accountId) });
    }
    if (direction === Direction.BOTH) {
      qb.where({
        $and: [
          { to: new Subject(false, accountId) },
          { from: new Subject(false, accountId) },
        ],
      });
    }
    qb.andWhere({
      createdAt: {
        $gte: startAt,
        $lte: endAt,
      },
    });
    return qb
      .select(['*'])
      .execute('all')
      .then((logs) => {
        const transactionItems = logs.map((log) => {
          return new TransactionItem({
            subject: new TransactionSubject({ id: accountId, system: false }),
            cost: log.amount,
            out:
              direction === Direction.BOTH
                ? false
                : direction === Direction.OUT,
            createdAt: log.createdAt.toString(),
          });
        });
        return ok(transactionItems);
      })
      .catch((reason) => {
        const perr = new PersistenceError(reason);
        return err(new DomainError(perr.message, perr));
      });
  }
}
