import z from 'zod';
import { Context, IReward, Reward } from '../reward.decorator';
import { InfraError } from '@app/shared';
import { err, ok, Result } from 'neverthrow';
import {
  SYSTEM_WALLET_ID,
  Transaction,
  TransactionStatus,
  Wallet,
  WalletNotFound,
} from '@app/gamification/economic';
import { AccountId } from 'src/auth';

export const RewardPointSchema = z.object({
  accountID: z.string(),
  amount: z.number().int(),
});

@Reward({
  name: 'wallet/point',
  schema: RewardPointSchema,
})
export class RewardPoint implements IReward<typeof RewardPointSchema, void> {
  async execute(
    param: { accountID: AccountId; amount: number },
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
      detail: '',
    });
    wallet.addTransaction(transaction);
    ctx.write.persist(transaction);
    ctx.write.persist(wallet);
    return ok();
  }
}
