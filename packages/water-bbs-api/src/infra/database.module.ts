import { DynamicModule, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import cfg from '../../mikro-orm.config';

@Module({})
export class DatabaseModule {
  static forRoot(options?: MikroOrmModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [MikroOrmModule.forRoot(options ?? cfg)],
    };
  }
  static forTest(options?: MikroOrmModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MikroOrmModule.forRoot({
          ...(options ?? cfg),
          dbName: ':memory:',
        }),
      ],
    };
  }
}
