import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TransferLog, Wallet } from 'water-bbs-migration';

@Module({
  imports: [MikroOrmModule.forFeature([Wallet, TransferLog])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
