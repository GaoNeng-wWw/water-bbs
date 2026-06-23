import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Wallet, TransferLog } from 'water-bbs-migration';
import { TransactionToSystemHandler, TransactionHandler } from './commands';
import { EnsureBalanceHandler } from './queries';

@Module({
  imports: [MikroOrmModule.forFeature([Wallet, TransferLog])],
  providers: [
    TransactionToSystemHandler,
    TransactionHandler,
    EnsureBalanceHandler,
  ],
  exports: [],
})
export class BankModule {}
