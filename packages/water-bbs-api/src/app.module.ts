import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MySqlDriver } from '@mikro-orm/mysql';
import {
  Account,
  Action,
  Category,
  Cert,
  FileReference,
  Ident,
  Permission,
  Post,
  ProposalComment,
  Proposals,
  Resource,
  ResourceOwnerMap,
  Role,
  Vote,
  VoteSlot,
  Wallet,
  TransferLog,
  Policy,
} from 'water-bbs-migration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SingleNode, yaml } from '@app/configure';
import { AccountModule } from './account/account.module';
import { RedisModule } from '@nestjs-redisx/core';
import { RateLimitPlugin } from '@nestjs-redisx/rate-limit';
import { AuthModule } from './auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard, PermissionGuard, RoleGuard } from '@app/shared';
import { JwtModule } from '@nestjs/jwt';
import { ResultInterceptor } from '@app/shared/interceptor';
import { RedisModule as LiaoLiaoRedis } from '@liaoliaots/nestjs-redis';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { ProposalModule } from './proposal/proposal.module';
import { VoteModule } from './vote/vote.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ActionModule } from './action/action.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppSerivce } from './app.service';
import { LocalStorage, STORAGE_ENGINE_KEY } from '@app/storage';
import { WalletModule } from './wallet/wallet.module';

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
          entities: [
            Account,
            Cert,
            Ident,
            Permission,
            Role,
            Post,
            Category,
            Proposals,
            Vote,
            VoteSlot,
            Action,
            ProposalComment,
            Resource,
            ResourceOwnerMap,
            Wallet,
            TransferLog,
            Policy,
          ],
          allowGlobalContext: true,
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          user: configService.get('database.username'),
          password: configService.get('database.password'),
          dbName: configService.get('database.dbName'),
        };
      },
    } as any),
    MikroOrmModule.forFeature([
      Account,
      Cert,
      Ident,
      Permission,
      Role,
      Post,
      Category,
      Proposals,
      Vote,
      VoteSlot,
      Action,
      FileReference,
      ProposalComment,
      Resource,
      ResourceOwnerMap,
    ]),
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
    ProposalModule,
    VoteModule,
    ScheduleModule.forRoot(),
    ActionModule,
    PermissionModule,
    RoleModule,
    AdminModule,
    WalletModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultInterceptor,
    },
    {
      provide: STORAGE_ENGINE_KEY,
      useFactory: (...deps) => deps,
      inject: [LocalStorage],
    },
    LocalStorage,
    AppSerivce,
  ],
  controllers: [AppController],
})
export class AppModule {}
