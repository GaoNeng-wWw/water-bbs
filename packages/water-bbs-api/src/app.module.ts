import { ConfigureModule, ConfigureService } from '@app/configure';
import { ErrorFilter, ResultInterceptor } from '@app/shared';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import path, { join } from 'path';
import cfg from '../mikro-orm.config';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { readFileSync } from 'fs';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { TopicModule } from './topic/topic.module';
import { ProfileModule } from './profile/profile.module';
import { WalletModule } from './wallet/wallet.module';
import { EngineModule } from '@app/engine/engine.module';
import { GovernanceMemberModule, ProposalModule } from '@app/gamification';

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
    RedisModule.forRootAsync({
      imports: [ConfigureModule],
      inject: [ConfigureService],
      useFactory(service) {
        const cfg = service as ConfigureService;
        return {
          config: {
            host: cfg.get('redis.host'),
            port: cfg.get('redis.port'),
            username: cfg.get('redis.user'),
            password: cfg.get('redis.pass'),
            db: cfg.get('redis.db'),
          },
        };
      },
    }),
    AuthModule,
    MikroOrmModule.forRoot(cfg),
    CategoryModule,
    TopicModule,
    ProfileModule,
    WalletModule,
    EngineModule,
    GovernanceMemberModule,
    ProposalModule
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
  ],
})
export class AppModule {
  constructor(private readonly redis: RedisService) {
    const r = this.redis.getOrThrow();
    r.defineCommand('issueToken', {
      lua: readFileSync(join(__dirname, './lua/issue-token.lua')).toString(),
      numberOfKeys: 0,
    });
    r.defineCommand('refreshToken', {
      lua: readFileSync(join(__dirname, './lua/refresh-token.lua')).toString(),
      numberOfKeys: 0,
    });
    r.defineCommand('revokeSession', {
      lua: readFileSync(join(__dirname, './lua/revoke-session.lua')).toString(),
      numberOfKeys: 0,
    });
    r.defineCommand('revokeAllSession', {
      lua: readFileSync(
        join(__dirname, './lua/revoke-all-session.lua'),
      ).toString(),
      numberOfKeys: 0,
    });
  }
}
