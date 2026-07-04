import { RedisService } from '@nestjs-redisx/core';
import { DomainError, err, isErr, ok } from 'water-bbs-shared';
import { endOfDay, getTime } from 'date-fns';
import { BankService } from '@app/bank';
import { TransactionDetail } from 'water-bbs-migration';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckInService {
  constructor(
    private redis: RedisService,
    private readonly bank: BankService,
  ) {}

  canCheckIn(accountId: string) {
    return this.redis.exists(`check-in:${accountId}`).then(Boolean).then(ok);
  }

  async checkin(account: string, time: Date) {
    if (await this.redis.exists(`check-in:${account}`)) {
      return err(new DomainError('DUPLICATE_CHECK_IN'));
    }
    const balance = Math.floor(Math.random() * 10);
    const transactionResult = await this.bank.transactionFromSystem(
      account,
      balance,
      new TransactionDetail('reward', { action: 'check-in' }),
    );
    if (isErr(transactionResult)) {
      return transactionResult;
    }
    await this.redis.set(`check-in:${account}`, '1');
    const expAt = endOfDay(time);
    await this.redis.expireat(`check-in:${account}`, getTime(expAt));
    return ok({ balance });
  }
}
