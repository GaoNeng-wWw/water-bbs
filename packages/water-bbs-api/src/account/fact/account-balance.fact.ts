import { FactHandler, IFactHandler } from '@app/gamification';
import { QueryBus } from '@nestjs/cqrs';
import { Almanac } from 'json-rules-engine';
import { isErr } from 'water-bbs-shared';
import { GetBalanceQuery } from '../../wallet/query';

@FactHandler('account-balance')
export class AccountBalanceFact implements IFactHandler<
  Record<string, any>,
  number
> {
  constructor(private qb: QueryBus) {}
  async getFact(
    params: Record<string, any>,
    almanac: Almanac,
  ): Promise<number> {
    const accountId = await almanac.factValue<string>('account-id');
    const balance = await this.qb.execute(new GetBalanceQuery(accountId));
    if (isErr(balance)) {
      throw balance.error;
    }
    return Number.parseInt(balance.value.balance);
  }
}
