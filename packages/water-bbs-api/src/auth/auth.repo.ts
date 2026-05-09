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
import { InjectRedis, RedisService } from '@nestjs-redisx/core';
import { isEmpty } from 'class-validator';

@Injectable()
export class AuthRepo implements ISessionRepo {
  constructor(
    @InjectRedis()
    private redis: RedisService,
  ) {}
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
  saveWithCas(
    accountID: string,
    exceptedVersion: string,
    session: Session,
    ttl: number,
  ): Promise<Result<string, PersistenceError>> {
    throw new Error('Method not implemented.');
  }
}
