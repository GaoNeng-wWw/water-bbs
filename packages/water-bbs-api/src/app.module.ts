import { ConfigureModule, ConfigureService } from '@app/configure';
import { ErrorFilter } from '@app/shared';
// import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import path, { join } from 'path';
// import cfg from '../mikro-orm.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    I18nModule.forRoot({
      loaderOptions: {
        path: path.join(__dirname, '../libs/translation/'),
        watch: true,
      },
      fallbackLanguage: 'en-us',
      typesOutputPath: join(
        __dirname,
        '../libs/shared/src/.generated/i18n.generated.ts',
      ),
      resolvers: [new HeaderResolver(['x-lang'])],
    }),
    ConfigureModule,
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
    // MikroOrmModule.forRoot(cfg),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class AppModule {}
