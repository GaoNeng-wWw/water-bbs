import { Injectable } from '@nestjs/common';
import { ISessionRepo } from './domain/session.repo';
import { AccountID } from '../account/domain';
import {
  Result,
  PersistenceError,
  Option,
  ok,
  err,
  isErr,
  none,
  some,
} from 'water-bbs-shared';
import { Session, TokenIndex } from './domain/ar';
import { RedisService } from '@nestjs-redisx/core';
import { isEmpty } from 'class-validator';
import { OptimisticLockConflict } from '@app/shared';

@Injectable()
export class AuthRepo implements ISessionRepo {
  constructor(private redis: RedisService) {}
  async upsert(session: Session): Promise<Result<boolean, PersistenceError>> {
    const sub = session.get('sub');
    const sid = session.get('sid');
    const sessionPayloadResult = this.redis
      .hmset(`session:${sid}`, session.toObject())
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(reason)));
    const mapCreateStatus = await this.redis
      .hset('session-map', sub, sid)
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(reason)));
    const tokenIndexMap = session
      .get('tokenIndex')
      .map((tokenIndex) => {
        return [
          tokenIndex.createdAt + tokenIndex.ttl,
          JSON.stringify(tokenIndex),
        ];
      })
      .flat();
    const tokenIndexRes = await this.redis
      .zadd(`session:${sid}:token-index`, ...tokenIndexMap)
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(reason)));
    if (isErr(tokenIndexRes)) {
      return err(tokenIndexRes.error);
    }
    if (isErr(mapCreateStatus)) {
      return err(mapCreateStatus.error);
    }
    return sessionPayloadResult;
  }
  async findAuthSessionBySessionID(
    sessionID: string,
  ): Promise<Result<Option<Session>, PersistenceError>> {
    const sessionPayloadResult = await this.redis
      .hgetall(`session:${sessionID}`)
      .then((object) => ok(object))
      .catch((reason) => err(new PersistenceError(reason)));
    if (isErr(sessionPayloadResult)) {
      return sessionPayloadResult;
    }
    const tokenIndexRes = await this.redis
      .zrange(`session:${sessionID}:token-index`, 0, -1)
      .then((members) => ok(members))
      .catch((reason) => err(new PersistenceError(reason)));
    if (isErr(tokenIndexRes)) {
      return tokenIndexRes;
    }
    const rawSessionPayload = sessionPayloadResult.value;
    if (isEmpty(rawSessionPayload)) {
      return ok(none);
    }
    const tokenIndexes = tokenIndexRes.value.map((raw) => {
      return JSON.parse(raw) as TokenIndex;
    });
    const session = Session.fromPOJO(rawSessionPayload, tokenIndexes);
    if (isErr(session)) {
      return err(new PersistenceError(session.error));
    }
    return ok(some(session.value));
  }
  async findAuthSessionByAccountID(
    accountID: AccountID,
  ): Promise<Result<Option<Session>, PersistenceError>> {
    const sessionID = await this.redis
      .hget('session-map', accountID.get('value'))
      .then((sessionID) => ok(sessionID))
      .catch((reason) => err(new PersistenceError(reason)));
    if (isErr(sessionID)) {
      return sessionID;
    }
    const sid = sessionID.value;
    if (!sid) {
      return ok(none);
    }
    return this.findAuthSessionBySessionID(sid);
  }
  async saveWithCas(
    accountID: string,
    expectedVersion: string,
    session: Session,
    ttl: number,
  ): Promise<Result<string, PersistenceError>> {
    const lua = `
      -- ARGV[1]   : AccountID
      -- ARGV[2]   : 预期旧版本号 (oldVersion)
      -- ARGV[3]   : 新版本号 (newVersion)
      -- ARGV[4]   : 新的 sid
      -- ARGV[5]   : 新的 sub
      -- ARGV[6]   : 新的 status
      -- ARGV[7]   : 新的 tokenIndex (JSON 字符串)
      -- ARGV[8]   : TTL (秒，-1 表示永不过期)

      local accountID = ARGV[1]
      local oldVersion = ARGV[2]
      local newVersion = ARGV[3]
      local sid = ARGV[4]
      local sub = ARGV[5]
      local status = ARGV[6]
      local tokenIndex = ARGV[7]
      local ttl = tonumber(ARGV[8])

      local sessionID = redis.call("HGET", "session-map", accountID) or ''

      if sessionID == '' then
        return 0 -- 找不到session
      end

      local key = 'session' .. ':' .. sessionID

      -- 获取当前版本号（字段不存在时视为空字符串）
      local currentVersion = redis.call('HGET', key, 'version') or ''

      if currentVersion == oldVersion then
          -- 原子更新所有字段（包括版本号）
          redis.call('HMSET', key,
              'sid', sid,
              'sub', sub,
              'status', status,
              'version', newVersion,
              'tokenIndex', tokenIndex
          )
          -- 处理过期时间
          if ttl > 0 then
              redis.call('EXPIRE', key, ttl)
          elseif ttl == -1 then
              redis.call('PERSIST', key)
          end
          return 1  -- 成功
      else
          return 0  -- 版本冲突
      end
    `;
    const newVersion = session.get('version');
    const tokenIndexJson = JSON.stringify(session.get('tokenIndex'));
    const saveResult = await this.redis
      .eval(
        lua,
        [],
        [
          accountID,
          expectedVersion,
          newVersion,
          session.get('sid'),
          session.get('sub'),
          session.get('status'),
          tokenIndexJson,
          ttl.toString(),
        ],
      )
      .then((status) => {
        if (status) {
          return ok(true);
        }
        return err(new OptimisticLockConflict(null, {}));
      })
      .catch((reason) => err(new PersistenceError(reason, {})));
    if (isErr(saveResult)) {
      return saveResult;
    }
    return ok(newVersion);
  }
}
