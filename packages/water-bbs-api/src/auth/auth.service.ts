import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AccountAliveQuery, CheckPasswordQuery } from '../account/queries';
import { IdentEnum } from 'water-bbs-migration';
import {
  err,
  isErr,
  ok,
  PersistenceError,
  pipeOption,
  pipeResult,
  Result,
  unwrapOr,
} from 'water-bbs-shared';
import { v4, v7 } from 'uuid';
import type { ISessionRepo } from './domain/session.repo';
import { AccountID } from 'src/account/domain';
import { RefreshTokenPayload, Session } from './domain/ar';
import { parse } from '@lukeed/ms';
import { withOptimisticLock } from '@app/shared';
import { SessionExpired } from './error/session-expired';

@Injectable()
export class AuthService {
  constructor(
    private readonly query: QueryBus,
    private readonly jwt: JwtService,
    private readonly sessionRepo: ISessionRepo,
  ) {}
  async login(identType: IdentEnum, identValue: string, certValue: string) {
    const res = pipeResult(
      await this.query.execute(
        new AccountAliveQuery(identType, identValue, certValue),
      ),
    );
    if (res.isErr()) {
      return err(res.unwrapErr());
    }
    const account = res.unwrap();
    if (!account.alive) {
      //
      return;
    }
    const id = account.accountID;
    const checkRes = pipeResult(
      await this.query.execute(new CheckPasswordQuery(id, certValue)),
    );
    if (checkRes.isErr()) {
      return err(checkRes.unwrapErr());
    }
    const { valid } = checkRes.unwrap();
    if (!valid) {
      return;
    }
    const sessionID = v7();
    const accessTokenID = v7();
    const refreshTokenID = v7();
    const at = this.jwt.sign(
      {
        jti: accessTokenID,
        sub: account.accountID,
        tokenType: 'access',
        sessionID,
      },
      { expiresIn: '15min' },
    );
    const rt = this.jwt.sign(
      {
        jti: refreshTokenID,
        sub: account.accountID,
        tokenType: 'refresh',
        accessTokenID: accessTokenID,
      },
      { expiresIn: '1d' },
    );
    const sessionTTL = parse('15min') ?? 0;
    const putRes = await withOptimisticLock({
      load: async () => {
        const res = pipeResult(
          await this.sessionRepo.findAuthSessionByAccountID(
            new AccountID({ value: account.accountID }),
          ),
        );
        if (res.isErr()) {
          return err(res.error);
        }
        return ok(
          unwrapOr(
            res.unwrap(),
            new Session({
              sid: v7(),
              status: 'ALIVE',
              sub: account.accountID,
              tokenIndex: [],
              version: v4(),
            }),
          ),
        );
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      modify: async (cur) => {
        if (isErr(cur)) {
          return err(cur.error);
        }
        const session = cur.value;
        if (session.total > 5) {
          session.popFirst();
        }
        session.pushToken(accessTokenID, refreshTokenID, sessionTTL);
        return ok(session);
      },
      save: async (exceptVersion: Result<string, PersistenceError>, cur) => {
        const newVersion = v4();
        if (isErr(cur)) {
          return err(cur.error);
        }
        if (isErr(exceptVersion)) {
          return err(exceptVersion.error);
        }
        const v = exceptVersion.value;
        const session = cur.value.setVersion(newVersion);
        const sessionRes = pipeResult(
          await this.sessionRepo.saveWithCas(
            account.accountID,
            v,
            session,
            sessionTTL,
          ),
        );
        if (sessionRes.isErr()) {
          return err(sessionRes.error);
        }
        return ok(newVersion);
      },
      getVersion: (cur) => {
        if (isErr(cur)) {
          return err(cur.error);
        }
        return ok(cur.value.get('version'));
      },
      setVersion: (cur, version) => {
        if (isErr(cur)) {
          return err(cur.error);
        }
        let versionString = v4();
        if (version) {
          if (!isErr(version)) {
            versionString = version.value;
          } else {
            return err(version.error);
          }
        }
        return ok(cur.value.setVersion(versionString));
      },
    });
    if (isErr(putRes)) {
      return err(putRes.error);
    }
    const sessionRes = putRes.value;
    if (isErr(sessionRes)) {
      return err(sessionRes.error);
    }

    return ok({ accessToken: at, refreshToken: rt });
  }

  async logout(accountID: string, accessTokenID: string) {
    const sessionResult = pipeResult(
      await this.sessionRepo.findAuthSessionByAccountID(
        new AccountID({ value: accountID }),
      ),
    );
    if (sessionResult.isErr()) {
      return err(sessionResult.unwrapErr());
    }
    const maybeSession = pipeOption(sessionResult.unwrap());
    if (maybeSession.isNone()) {
      // 把token加入黑名单
      // 为什么会存在没有session但是能拿到token的情况
    }
    let session = maybeSession.unwrap();
    session = session.removeTokenByAccessTokenID(accessTokenID);
    const upsertResult = pipeResult(await this.sessionRepo.upsert(session));
    if (upsertResult.isErr()) {
      return err(upsertResult.error);
    }
    // TODO: 发布一个领域事件
    return ok(true);
  }
  async refresh(accountID: string, refreshToken: string) {
    const { jti, accessTokenID } =
      this.jwt.decode<RefreshTokenPayload>(refreshToken);
    const newAccessTokenID = v7();
    const refreshTokenID = v7();
    const sessionID = v7();
    const at = this.jwt.sign(
      {
        jti: newAccessTokenID,
        sub: accountID,
        tokenType: 'access',
        sessionID,
      },
      { expiresIn: '15min' },
    );
    const rt = this.jwt.sign(
      {
        jti: refreshTokenID,
        sub: accountID,
        tokenType: 'refresh',
        accessTokenID: accessTokenID,
      },
      { expiresIn: '1d' },
    );

    const sessionTTL = parse('15min') || 0;
    const handle = await withOptimisticLock({
      load: async () => {
        const sessionRes = pipeResult(
          await this.sessionRepo.findAuthSessionByAccountID(
            new AccountID({ value: accountID }),
          ),
        );
        if (sessionRes.isErr()) {
          return err(sessionRes.error);
        }
        const sessionOption = pipeOption(sessionRes.unwrap());
        if (sessionOption.isNone()) {
          return err(new SessionExpired());
        }
        const session = sessionOption.unwrap();
        return ok(session);
      },
      modify: (entity) => {
        if (isErr(entity)) {
          return err(entity.error);
        }
        const session = entity.value
          .removeTokenByAccessTokenID(accessTokenID)
          .removeTokenByRefreshTokenID(jti);
        return ok(session);
      },
      save: async (oldVersion: Result<string, any>, entity) => {
        if (isErr(entity)) {
          return err(entity.error);
        }
        const newVersion = v4();
        const session = entity.value.setVersion(newVersion);
        if (isErr(oldVersion)) {
          return err(oldVersion.error);
        }
        const version = oldVersion.value;
        const handle = pipeResult(
          await this.sessionRepo.saveWithCas(
            accountID,
            version,
            session,
            sessionTTL,
          ),
        );
        if (handle.isErr()) {
          return err(handle.error);
        }
        return ok(newVersion);
      },
      getVersion: (cur): Result<string, any> => {
        if (isErr(cur)) {
          return err(cur.error);
        }
        return ok(cur.value.get('version'));
      },
      setVersion: (cur, version) => {
        if (isErr(version)) {
          return err(version.error);
        }
        const v = version.value;
        if (isErr(cur)) {
          return err(cur.error);
        }
        const session = cur.value;
        session.setVersion(v);
      },
    });
    if (isErr(handle)) {
      return err(handle.error);
    }
    const runResult = handle.value;
    if (runResult && isErr(runResult)) {
      return err(runResult.error);
    }
    return { accessToken: at, refreshToken: rt };
  }
}
