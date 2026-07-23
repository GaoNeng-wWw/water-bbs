import { BankService } from '@app/bank';
import {
  IRewardHandler,
  RewardHandler,
  RewardHandlerParam,
} from '@app/gamification';
import { TransactionDetail } from 'water-bbs-migration';
import z from 'zod';

@RewardHandler({
  code: 'reward.account.balance',
  label: 'AccountBalanceReward',
  schema: z.number(),
})
export class RewardBalance implements IRewardHandler<z.ZodNumber> {
  constructor(private readonly bank: BankService) {}
  async handle(
    { userId }: RewardHandlerParam,
    dynamicParam: number,
  ): Promise<void> {
    await this.bank.transactionFromSystem(
      userId,
      dynamicParam,
      new TransactionDetail('reward', { balance: dynamicParam.toString() }),
    );
    return;
  }
}
