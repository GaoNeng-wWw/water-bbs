import z from 'zod';
import { IReward, Reward, RewardContext } from './reward.decorator';
import { DomainError } from '@app/shared';
import { err, ok, Result } from 'neverthrow';
import { TaskRewardParamParseError } from '../error/task-reward-param-parse-error';
import {
  SYSTEM_WALLET_ID,
  Transaction,
  TransactionStatus,
  Wallet,
  WalletNotFound,
} from '@app/gamification/economic';
import { AccountId } from 'src/auth';

export const schema = z.object({
  accountID: z.string(),
  amount: z.int(),
});

export type Param = z.infer<typeof schema>;

@Reward({ name: 'wallet/point-incr' })
export class Point implements IReward {
  constructor() {}
  async execute(
    param: Record<string, any>,
    ctx: RewardContext,
  ): Promise<Result<void, DomainError>> {
    const { data, success, error } = schema.safeParse(param);
    if (!success) {
      return err(new TaskRewardParamParseError(error.message));
    }
    const { accountID, amount } = data;
    const wallet = await ctx.read.findOne(Wallet, {
      id: accountID as AccountId,
    });
    if (!wallet) {
      return err(new WalletNotFound());
    }
    const transcation = ctx.write.create(Transaction, {
      from: SYSTEM_WALLET_ID,
      to: accountID as AccountId,
      amount: amount.toString(),
      status: TransactionStatus.Success,
      detail: 'REWARD',
    });
    ctx.write.persist(transcation);
    wallet.addTransaction(transcation);
    ctx.write.upsert(wallet);
    return ok();
  }
}
