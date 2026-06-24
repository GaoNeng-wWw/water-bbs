import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetBalanceQuery } from './query';
import {
  Direction,
  GetTransactionLogListQuery,
} from './query/get-transaction-list';

@Injectable()
export class WalletService {
  constructor(private readonly qb: QueryBus) {}

  getBalance(id: string) {
    return this.qb.execute(new GetBalanceQuery(id));
  }
  listTranscation(id: string, year: number, direction: Direction) {
    return this.qb.execute(
      new GetTransactionLogListQuery(year, id, 100, direction),
    );
  }
}
