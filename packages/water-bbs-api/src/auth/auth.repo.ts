import { Injectable } from '@nestjs/common';
import { ISessionRepo } from './domain/session.repo';
import { AccountID } from '../account/domain';
import { Result, PersistenceError, ok, err } from 'water-bbs-shared';
import { AccessTokenPayload, RefreshTokenPayload } from './domain/ar';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AuthRepo implements ISessionRepo {
  private redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }
  removeAllToken(
    accountId: string,
  ): Promise<Result<boolean, PersistenceError>> {
    return this.redis
      .fcall('removeAllTokenByAccountId', 0, accountId)
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(reason, { reason })));
  }
  async putToken(
    accessToken: AccessTokenPayload,
    refreshToken: RefreshTokenPayload,
  ): Promise<Result<number, PersistenceError>> {
    return this.redis
      .fcall(
        'putTokenPair',
        0,
        accessToken.sub,
        accessToken.jti,
        refreshToken.jti,
        accessToken.ttl,
        refreshToken.ttl,
        3,
      )
      .then(() => ok(1))
      .catch((reason) => err(new PersistenceError(reason, { reason })));
  }
  async removeToken(
    tokenId: string,
    accountId: string,
  ): Promise<Result<boolean, PersistenceError>> {
    return this.redis
      .fcall('removeToken', 0, accountId, tokenId)
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(reason, { reason })));
  }
  getTokenTotal(
    accountID: AccountID,
  ): Promise<Result<number, PersistenceError>> {
    return this.redis
      .fcall('getTokenTotal', 0, accountID.get('value'))
      .then((total) => ok(total as number))
      .catch((reason) => err(new PersistenceError(reason, { reason })));
  }
  tokenAlive(
    accountID: string,
    tokenID: string,
  ): Promise<Result<boolean, PersistenceError>> {
    return this.redis
      .fcall('tokenAlive', 0, accountID, tokenID)
      .then((status) => ok(Boolean(status)))
      .catch((reason) => err(new PersistenceError(reason, { reason })));
  }
}
