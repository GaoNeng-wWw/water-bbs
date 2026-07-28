import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailRegistor, Registor, RegistorKey } from './application/service';
import { SendVerificationEmailService } from './application/event-handler';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Account, Credential, Identifier } from './entites';
import { NotificationModule } from '@app/notification/notification.module';
import { LoginService, RegisterService } from './application';

@Module({
  imports: [
    MikroOrmModule.forFeature([Identifier, Credential, Account]),
    NotificationModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SendVerificationEmailService,
    MailRegistor,
    {
      provide: RegistorKey,
      useFactory(...args) {
        return args as Registor[];
      },
      inject: [MailRegistor],
    },
    LoginService,
    RegisterService,
  ],
})
export class AuthModule {}
