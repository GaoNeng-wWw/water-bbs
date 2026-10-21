import z from 'zod';
import { Context, IReward, Reward } from '../reward.decorator';
import { InfraError, localMap } from '@app/shared';
import { err, ok, Result } from 'neverthrow';
import {
  SYSTEM_WALLET_ID,
  Transaction,
  TransactionStatus,
  Wallet,
  WalletNotFound,
} from '@app/gamification/economic';
import { AccountId } from 'src/auth';

export const paramSchema = z.object({
  accountID: z.string(),
  amount: z.number().int(),
  detail: z.string().optional(),
});

export const pointRewardSchema = z.object({
  use: z.literal('wallet/point'),
  args: z.object({
    amount: z.number().int(),
    detail: z.string().optional(),
  }),
  desc: localMap(),
});

@Reward({
  name: 'wallet/point',
  schema: paramSchema,
})
export class RewardPoint implements IReward<typeof paramSchema, void> {
  async execute(
    param: { accountID: AccountId; amount: number; detail?: string },
    ctx: Context,
  ): Promise<Result<void, InfraError>> {
    const wallet = await ctx.read.findOne(Wallet, {
      id: param.accountID,
    });
    if (!wallet) {
      return err(new WalletNotFound());
    }
    const transaction = ctx.write.create(Transaction, {
      from: SYSTEM_WALLET_ID,
      to: wallet.id,
      amount: param.amount.toString(),
      status: TransactionStatus.Success,
      detail: param.detail ?? '',
    });
    ctx.write.persist(transaction);
    ctx.write.persist(wallet);
    return ok();
  }
}
