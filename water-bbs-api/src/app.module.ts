import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MySqlDriver } from '@mikro-orm/mysql';
import {
  AccountEntity,
  CertEntity,
  IdentEntity,
  PermissionEntity,
  RoleEntity,
} from 'water-bbs-migration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { yaml } from '@app/configure';
import { AccountModule } from './account/account.module';

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
        entities: [
          AccountEntity,
          RoleEntity,
          PermissionEntity,
          IdentEntity,
          CertEntity,
        ],
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        user: configService.get('database.username'),
        password: configService.get('database.password'),
        dbName: configService.get('database.dbName'),
      }),
    }),
    AccountModule,
  ],
})
export class AppModule {}
