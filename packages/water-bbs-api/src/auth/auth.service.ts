import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AccountAliveQuery, CheckPasswordQuery } from '../account/queries';
import { IdentEnum } from 'water-bbs-migration';
import {
  ApplicationServiceError,
  err,
  isErr,
  ok,
  pipeOption,
  pipeResult,
  Result,
  unwrapOr,
} from 'water-bbs-shared';
import { v4, v7 } from 'uuid';
import { InjectSessionRepo, type ISessionRepo } from './domain/session.repo';
import { AccountID } from 'src/account/domain';
import { AccessTokenPayload, RefreshTokenPayload, Session } from './domain/ar';
import { parse } from '@lukeed/ms';
import { OptimisticLockConflict, withOptimisticLock } from '@app/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly query: QueryBus,
    private readonly jwt: JwtService,
    @InjectSessionRepo()
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
      return err(new ApplicationServiceError('ACCOUNT_EXPIRED'));
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
      return err(new ApplicationServiceError('INVALID_CREDENTIALS'));
    }
    const sessionID = v7();
    const accessTokenID = v7();
    const refreshTokenID = v7();
    const at = this.jwt.sign<AccessTokenPayload>(
      {
        jti: accessTokenID,
        sub: account.accountID,
        tokenType: 'access',
        sessionID,
      },
      { expiresIn: '15min' },
    );
    const rt = this.jwt.sign<RefreshTokenPayload>(
      {
        jti: refreshTokenID,
        sub: account.accountID,
        tokenType: 'refresh',
        accessTokenID: accessTokenID,
        sessionID,
      },
      { expiresIn: '1d' },
    );
    const refreshTokenTTL = parse('1d') ?? 0;
    const putResult = await withOptimisticLock({
      load: async () => {
        const sessionRes = await this.sessionRepo.findAuthSessionByAccountID(
          new AccountID({ value: account.accountID }),
        );
        if (isErr(sessionRes)) {
          return sessionRes;
        }
        const session = unwrapOr(
          sessionRes.value,
          new Session({
            sid: sessionID,
            sub: account.accountID,
            tokenIndex: [],
            version: '',
            status: 'ALIVE',
          }),
        );
        return ok(session);
      },
      modify: (
        entity: Session,
      ): Result<Session, Error> | Promise<Result<Session, Error>> => {
        let session = entity;
        while (session.total > 5) {
          session = session.popFirst();
        }
        session = session.pushToken(
          accessTokenID,
          refreshTokenID,
          refreshTokenTTL,
        );
        return ok(session);
      },
      save: async (
        entity: Session,
        oldVersion,
      ): Promise<Result<string, OptimisticLockConflict>> => {
        const newVersion = v4();
        const session = entity.setVersion(newVersion);
        const res = await this.sessionRepo.saveWithCas(
          account.accountID,
          oldVersion,
          session,
          -1,
        );
        if (isErr(res)) {
          if (res.error instanceof OptimisticLockConflict) {
            return res;
          }
          return err(new OptimisticLockConflict(res.error, {}));
        }
        return ok(newVersion);
      },
      getVersion: (entity: Session): string => {
        return entity.get('version');
      },
      setVersion: (entity: Session, newVersion: string): Session => {
        return entity.setVersion(newVersion);
      },
    });
    if (isErr(putResult)) {
      return putResult;
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
      // TODO: 把token加入黑名单
      // TODO: 为什么会存在没有session但是能拿到token的情况
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
    const { sessionID } = this.jwt.decode<RefreshTokenPayload>(refreshToken);
    const newAccessTokenID = v7();
    const refreshTokenID = v7();
    const at = this.jwt.sign<AccessTokenPayload>(
      {
        jti: newAccessTokenID,
        sub: accountID,
        tokenType: 'access',
        sessionID,
      },
      { expiresIn: '15min' },
    );
    const rt = this.jwt.sign<RefreshTokenPayload>(
      {
        jti: refreshTokenID,
        sub: accountID,
        tokenType: 'refresh',
        accessTokenID: newAccessTokenID,
        sessionID,
      },
      { expiresIn: '1d' },
    );
    const tokenTTL = parse('1d')!;
    const putResult = await withOptimisticLock({
      load: async () => {
        const res = await this.sessionRepo.findAuthSessionByAccountID(
          new AccountID({ value: accountID }),
        );
        if (isErr(res)) {
          return res;
        }
        return ok(
          unwrapOr(
            res.value,
            new Session({
              sid: sessionID,
              sub: accountID,
              status: 'ALIVE',
              tokenIndex: [],
              version: '',
            }),
          ),
        );
      },
      modify: function (
        entity: Session,
      ): Result<Session, Error> | Promise<Result<Session, Error>> {
        let session = entity;
        while (session.total > 5) {
          session = session.popFirst();
        }
        session = session.pushToken(newAccessTokenID, refreshTokenID, tokenTTL);
        return ok(session);
      },
      save: async (
        entity: Session,
        oldVersion: string,
      ): Promise<Result<string, OptimisticLockConflict>> => {
        const version = v4();
        let session = entity;
        session = session.setVersion(version);
        const saveResult = await this.sessionRepo.saveWithCas(
          accountID,
          oldVersion,
          session,
          -1,
        );
        if (isErr(saveResult)) {
          return saveResult;
        }

        return ok(version);
      },
      getVersion: function (entity: Session) {
        return entity.get('version');
      },
      setVersion: function (entity: Session, newVersion: string): Session {
        entity.set('version').to(newVersion);
        return entity;
      },
    });
    if (isErr(putResult)) {
      return putResult;
    }
    return ok({ accessToken: at, refreshToken: rt });
  }
}
