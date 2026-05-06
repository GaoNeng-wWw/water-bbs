import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Account, Cert, Ident, Permission, Role } from 'water-bbs-migration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SingleNode, yaml } from '@app/configure';
import { AccountModule } from './account/account.module';
import { RedisModule } from '@nestjs-redisx/core';
import { RateLimitPlugin } from '@nestjs-redisx/rate-limit';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [yaml],
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        driver: MySqlDriver,
        entities: [Account, Cert, Ident, Permission, Role],
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        user: configService.get('database.username'),
        password: configService.get('database.password'),
        dbName: configService.get('database.dbName'),
      }),
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: any) => {
        const cfg = configService as ConfigService;
        if (cfg.get('redis.type') === 'single') {
          return {
            clients: {
              type: 'single',
              host: cfg.get('redis.host') as string,
              port: cfg.get('redis.port') as number,
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
    AccountModule,
  ],
})
export class AppModule {}
