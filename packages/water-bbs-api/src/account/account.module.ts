import { Module } from '@nestjs/common';
import { AccountService } from './application';
import { AccountController } from './account.controller';
import { ACCOUNT_RESGISTOR_REJECTION_KEY } from './domain';
import { MailRegistor } from './infra/registor/mail.registor';
import { ACCOUNT_REPO_TOKEN } from './domain/repo/account.repo';
import { AccountRepo } from './infra/repo/account.repo';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    {
      provide: ACCOUNT_REPO_TOKEN,
      useValue: AccountRepo,
    },
    {
      provide: ACCOUNT_RESGISTOR_REJECTION_KEY,
      useValue: [MailRegistor],
    },
  ],
})
export class AccountModule {}
