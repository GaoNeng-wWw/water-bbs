import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MySqlDriver } from '@mikro-orm/mysql';
import {
  Account,
  Category,
  Cert,
  Ident,
  Permission,
  Post,
  Role,
} from 'water-bbs-migration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SingleNode, yaml } from '@app/configure';
import { AccountModule } from './account/account.module';
import { RedisModule } from '@nestjs-redisx/core';
import { RateLimitPlugin } from '@nestjs-redisx/rate-limit';
import { AuthModule } from './auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@app/shared';
import { JwtModule } from '@nestjs/jwt';
import { ResultInterceptor } from '@app/shared/interceptor';
import { RedisModule as LiaoLiaoRedis } from '@liaoliaots/nestjs-redis';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { StorageModule } from '@app/storage';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [yaml],
    }),
    CqrsModule.forRoot({}),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          driver: MySqlDriver,
          entities: [Account, Cert, Ident, Permission, Role, Post, Category],
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          user: configService.get('database.username'),
          password: configService.get('database.password'),
          dbName: configService.get('database.dbName'),
        };
      },
    } as any),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: any) => {
        const cfg = configService as ConfigService;
        if (cfg.get('redis.type') === 'single') {
          return {
            clients: {
              default: {
                type: 'single',
                host: cfg.get('redis.host') as string,
                port: cfg.get('redis.port') as number,
              },
            },
            global: {
              debug: true,
            },
          };
        }
        return {
          clients: {
            type: 'cluster',
            nodes: cfg.get('redis.nodes') as SingleNode[],
          },
          global: {
            debug: true,
          },
        };
      },
      plugins: [new RateLimitPlugin()],
    }),
    LiaoLiaoRedis.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: any) {
        return {
          config: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
          },
        };
      },
    }),
    JwtModule.register({
      global: true,
      secretOrPrivateKey: 'tset-secret',
    }),
    AccountModule,
    AuthModule,
    PostModule,
    CategoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultInterceptor,
    },
  ],
})
export class AppModule {}
