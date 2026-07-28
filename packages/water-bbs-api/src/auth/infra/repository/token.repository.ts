import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Jti } from '../entites';

@Injectable()
export class TokenRepository {
  constructor(private readonly redisSrv: RedisService) {}
  getTokenByJti(jti: Jti) {
    const redis = this.redisSrv.getOrThrow();
    return redis.get(`token:${jti}`);
  }
}
