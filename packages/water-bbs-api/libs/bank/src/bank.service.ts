import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TransactionDetail } from 'water-bbs-migration';
import { DomainError, Result } from 'water-bbs-shared';
import { TransactionCommand, TransactionToSystemCommand } from './commands';
import { EnsureBalanceQuery } from './queries';

@Injectable()
export class BankService {
  constructor(
    private readonly cb: CommandBus,
    private readonly qb: QueryBus,
  ) {}

  transaction(
    source: string,
    target: string,
    cost: number,
    detail: TransactionDetail,
  ) {
    return this.cb.execute(
      new TransactionCommand(source, target, cost, detail),
    );
  }

  transactionToSystem(source: string, cost: number, detail: TransactionDetail) {
    return this.cb.execute(
      new TransactionToSystemCommand(source, cost, detail),
    );
  }

  ensureBalance(subject: string, cost: number) {
    return this.qb.execute<Result<boolean, DomainError>>(
      new EnsureBalanceQuery(subject, cost),
    );
  }
}
