import { Module } from '@nestjs/common';
import { AccountService } from './application';
import { AccountController } from './account.controller';
import { ACCOUNT_RESGISTOR_REJECTION_KEY } from './domain';
import { MailRegistor } from './infra/registor/mail.registor';
import { ACCOUNT_REPO_TOKEN } from './domain/repo/account.repo';
import { AccountRepo } from './infra/repo/account.repo';
import {
  FEATURE_LOADER_TOKEN,
  REGISTER_POLICY_TOKEN,
  RegisterPolicy,
  RedisFeatureLoader,
} from '@app/shared';
import { InviteCodeRepositoryToken } from './domain/repo/invite-code.repo';
import { InviteCodeRepository } from './infra/repo/invite-code.repo';

@Module({
  controllers: [AccountController],
  providers: [
    MailRegistor,
    {
      provide: ACCOUNT_REPO_TOKEN,
      useClass: AccountRepo,
    },
    {
      provide: ACCOUNT_RESGISTOR_REJECTION_KEY,

      useFactory: (...deps) => deps as [MailRegistor],
      inject: [MailRegistor],
    },
    {
      provide: REGISTER_POLICY_TOKEN,
      useClass: RegisterPolicy,
    },
    {
      provide: FEATURE_LOADER_TOKEN,
      useClass: RedisFeatureLoader,
    },
    {
      provide: InviteCodeRepositoryToken,
      useClass: InviteCodeRepository,
    },
    AccountService,
  ],
})
export class AccountModule {}
