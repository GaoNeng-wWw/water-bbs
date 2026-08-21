import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailRegistor, Registor, RegistorKey } from './application/service';
import { SendVerificationEmailService } from './application/event-handler';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Account, Credential, Identifier, Profile } from './entites';
import { NotificationModule } from '@app/notification/notification.module';
import {
  LoginService,
  RefreshTokenService,
  RegisterService,
} from './application';
import { VerificationCodeModule } from '@app/verification-code';
import { TokenGenrator } from './domain';
import { JwtGenerator, RedisSessionRepository, TokenRepository } from './infra';
import { CredentialVerifier } from './application/service/credential-verifer/verifier';
import { PasswordVerifier } from './application/service/credential-verifer/password.verifer';
import { WalletModule } from '@app/gamification';

@Module({
  imports: [
    MikroOrmModule.forFeature([Identifier, Credential, Account, Profile]),
    VerificationCodeModule,
    NotificationModule,
    WalletModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SendVerificationEmailService,
    MailRegistor,
    PasswordVerifier,
    RedisSessionRepository,
    TokenRepository,
    {
      provide: RegistorKey,
      useFactory(...args) {
        return args as Registor[];
      },
      inject: [MailRegistor],
    },
    {
      provide: TokenGenrator,
      useClass: JwtGenerator,
    },
    {
      provide: CredentialVerifier,
      useFactory(...args) {
        return args as CredentialVerifier[];
      },
      inject: [PasswordVerifier],
    },
    LoginService,
    RegisterService,
    RefreshTokenService,
  ],
})
export class AuthModule {}
