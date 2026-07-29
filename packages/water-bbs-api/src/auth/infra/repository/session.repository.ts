import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis as IRedis } from 'ioredis';

interface Redis extends IRedis {
  issueToken: (
    sessionId: string,
    sessionIssueAt: string,
    uid: string,
    accessTokenJti: string,
    accessToken: string,
    refreshToken: string,
    refreshTokenJti: string,
    accessTokenTTL: string,
    refreshTokenTTL: string,
    sessionLimit: string,
  ) => Promise<void>;
  refreshToken: (
    uid: string,
    newSessionId: string,
    sessionIssueAt: string,
    oldSessionId: string,
    newAccessTokenJti: string,
    newRefreshTokenJti: string,
    newAccessToken: string,
    newRefreshToken: string,
    accessTokenTTL: string,
    refreshTokenTTL: string,
  ) => Promise<void>;
  revokeSession: (uid: string, sessionId: string) => Promise<void>;
  revokeAllSession: (uid: string) => Promise<void>;
}

export type IssueTokenProps = {
  sessionId: string;
  sessionIssueAt: string;
  uid: string;
  accessTokenJti: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenJti: string;
  accessTokenTTL: string;
  refreshTokenTTL: string;
  sessionLimit: string;
};
export type RefreshTokenProps = {
  uid: string;
  newSessionId: string;
  sessionIssueAt: string;
  oldSessionId: string;
  newAccessTokenJti: string;
  newRefreshTokenJti: string;
  newAccessToken: string;
  newRefreshToken: string;
  accessTokenTTL: string;
  refreshTokenTTL: string;
};

@Injectable()
export class RedisSessionRepository {
  constructor(private readonly redisSrv: RedisService) {}
  issueToken({
    sessionId,
    sessionIssueAt,
    uid,
    accessTokenJti,
    accessToken,
    refreshToken,
    refreshTokenJti,
    accessTokenTTL,
    refreshTokenTTL,
    sessionLimit,
  }: IssueTokenProps) {
    const redis = this.redisSrv.getOrThrow() as Redis;
    return redis.issueToken(
      sessionId,
      sessionIssueAt,
      uid,
      accessTokenJti,
      accessToken,
      refreshToken,
      refreshTokenJti,
      accessTokenTTL,
      refreshTokenTTL,
      sessionLimit,
    );
  }

  refreshToken({
    uid,
    newSessionId,
    sessionIssueAt,
    oldSessionId,
    newAccessTokenJti,
    newRefreshTokenJti,
    newAccessToken,
    newRefreshToken,
    accessTokenTTL,
    refreshTokenTTL,
  }: RefreshTokenProps) {
    const redis = this.redisSrv.getOrThrow() as Redis;
    return redis.refreshToken(
      uid,
      newSessionId,
      sessionIssueAt,
      oldSessionId,
      newAccessTokenJti,
      newRefreshTokenJti,
      newAccessToken,
      newRefreshToken,
      accessTokenTTL,
      refreshTokenTTL,
    );
  }

  revokeSession(uid: string, sessionId: string) {
    const redis = this.redisSrv.getOrThrow() as Redis;
    return redis.revokeSession(uid, sessionId);
  }
  revokeAllSession(uid: string) {
    const redis = this.redisSrv.getOrThrow() as Redis;
    return redis.revokeAllSession(uid);
  }
}
