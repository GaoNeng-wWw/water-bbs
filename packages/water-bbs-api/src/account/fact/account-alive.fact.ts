import { FactHandler, IFactHandler } from '@app/gamification';
import { QueryBus } from '@nestjs/cqrs';
import { Almanac } from 'json-rules-engine';
import { AccountAliveQuery } from '../application';
import { isErr } from 'water-bbs-shared';
import z from 'zod';

@FactHandler('account-alive', z.boolean())
export class AccountAliveFact implements IFactHandler<
  Record<string, any>,
  boolean
> {
  constructor(private qb: QueryBus) {}
  async getFact(
    params: Record<string, any>,
    almanac: Almanac,
  ): Promise<boolean> {
    const accountId = await almanac.factValue<string>('account-id');
    const aliveResult = await this.qb.execute(new AccountAliveQuery(accountId));
    if (isErr(aliveResult)) {
      return false;
    }
    return aliveResult.value.alive;
  }
}
