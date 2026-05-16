import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SESSION_REPO_TOKEN } from './domain/session.repo';
import { AuthRepo } from './auth.repo';
import { TokenAliveHandler } from './queries/token-alive.query';
import { handlers } from './domain/command';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenAliveHandler,
    {
      provide: SESSION_REPO_TOKEN,
      useClass: AuthRepo,
    },
    ...handlers,
  ],
})
export class AuthModule {}
