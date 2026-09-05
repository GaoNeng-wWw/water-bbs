import { Injectable, Module, OnModuleInit } from '@nestjs/common';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigureModule, ConfigureService } from '@app/configure';

@Injectable()
export class RedisInitializer implements OnModuleInit {
  constructor(private readonly redis: RedisService) {}

  onModuleInit() {
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

@Module({
  imports: [
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
  ],

  providers: [RedisInitializer],

  exports: [RedisModule],
})
export class AppRedisModule {}
