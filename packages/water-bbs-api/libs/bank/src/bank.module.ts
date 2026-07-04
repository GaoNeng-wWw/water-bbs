import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Wallet, TransferLog } from 'water-bbs-migration';
import {
  TransactionToSystemHandler,
  TransactionHandler,
  TransactionFromSystemHandler,
} from './commands';
import { EnsureBalanceHandler } from './queries';
import { BankService } from './bank.service';

@Module({
  imports: [MikroOrmModule.forFeature([Wallet, TransferLog])],
  providers: [
    BankService,
    TransactionToSystemHandler,
    TransactionFromSystemHandler,
    TransactionHandler,
    EnsureBalanceHandler,
  ],
  exports: [BankService],
})
export class BankModule {}
