import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Transaction, Wallet } from '@app/gamification';

@Module({
  imports: [MikroOrmModule.forFeature([Wallet, Transaction])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
