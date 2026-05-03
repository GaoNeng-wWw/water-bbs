import { Module } from '@nestjs/common';
import { AccountService } from './application';
import { AccountController } from './account.controller';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
