import { ConfigureModule, ConfigureService } from '@app/configure';
import { ErrorFilter, ResultInterceptor } from '@app/shared';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import path, { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { TopicModule } from './topic/topic.module';
import { ProfileModule } from './profile/profile.module';
import { WalletModule } from './wallet/wallet.module';
import { EngineModule } from '@app/engine';
import {
  GovernanceMemberModule,
  MemberGuard,
  ProposalModule,
} from '@app/gamification';
import { AppRedisModule } from './redis.module';
import { DatabaseModule } from './infra/database.module';
import { ProposalModule as ProposalCRUD } from './proposal/proposal.module';

@Module({
  imports: [
    CqrsModule.forRoot({
      rethrowUnhandled: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (service: ConfigureService) => ({
        secret: service.get('token.secret'),
      }),
      inject: [ConfigureService],
    }),
    I18nModule.forRoot({
      loaderOptions: {
        path: path.join(__dirname, './translation/'),
        watch: true,
      },
      fallbackLanguage: 'en-us',
      typesOutputPath: join(
        __dirname,
        '../libs/shared/src/.generated/i18n.generated.ts',
      ),
      resolvers: [new HeaderResolver(['x-lang'])],
    }),
    ConfigureModule.register({
      path: join(__dirname, 'configs/config.json'),
    }),
    AppRedisModule,
    DatabaseModule.forRoot(),
    AuthModule,
    CategoryModule,
    TopicModule,
    ProfileModule,
    WalletModule,
    EngineModule,
    GovernanceMemberModule,
    ProposalModule,
    ProposalCRUD,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: MemberGuard,
    },
  ],
})
export class E2EAppModule {}
