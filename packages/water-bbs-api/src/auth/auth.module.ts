import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SESSION_REPO_TOKEN } from './domain/session.repo';
import { AuthRepo } from './auth.repo';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: SESSION_REPO_TOKEN,
      useClass: AuthRepo,
    },
  ],
})
export class AuthModule {}
