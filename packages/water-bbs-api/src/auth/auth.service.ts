import { HttpStatus, Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AccountAliveQuery, CheckPasswordQuery } from '../account/queries';
import { IdentEnum } from 'water-bbs-migration';
import {
  ApplicationServiceError,
  err,
  isErr,
  ok,
  pipeResult,
} from 'water-bbs-shared';
import { v7 } from 'uuid';
import { InjectSessionRepo, type ISessionRepo } from './domain/session.repo';
import { AccessTokenPayload, RefreshTokenPayload } from './domain/ar';
import { parse } from '@lukeed/ms';

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
      return err(
        new ApplicationServiceError('ACCOUNT_NOT_FOUND', HttpStatus.NOT_FOUND),
      );
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
      return err(
        new ApplicationServiceError(
          'INVALID_CREDENTIALS',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
    const sessionID = v7();
    const accessTokenID = v7();
    const refreshTokenID = v7();
    const accessTokenPayload: AccessTokenPayload = {
      jti: accessTokenID,
      sub: account.accountID,
      tokenType: 'access',
      sessionID,
      iat: Date.now(),
      ttl: parse('15min')!,
    };
    const at = this.jwt.sign(accessTokenPayload, {
      expiresIn: '15min',
    });
    const refreshTokenPayload: RefreshTokenPayload = {
      jti: refreshTokenID,
      sub: account.accountID,
      tokenType: 'refresh',
      accessTokenID: accessTokenID,
      sessionID,
      iat: Date.now(),
      ttl: parse('1d')!,
    };
    const rt = this.jwt.sign(refreshTokenPayload, {
      expiresIn: '1d',
    });
    const putRes = await this.sessionRepo.putToken(
      accessTokenPayload,
      refreshTokenPayload,
    );
    if (isErr(putRes)) {
      return putRes;
    }
    return ok({ accessToken: at, refreshToken: rt });
  }

  async logout(accountID: string, accessTokenID: string) {
    const sessionResult = pipeResult(
      await this.sessionRepo.tokenAlive(accountID, accessTokenID),
    );
    if (sessionResult.isErr()) {
      return err(sessionResult.unwrapErr());
    }
    const disabledResult = await this.sessionRepo.removeToken(
      accountID,
      accessTokenID,
    );
    if (isErr(disabledResult)) {
      return disabledResult;
    }
    return ok(true);
  }
  async refresh(accountID: string, refreshToken: string) {
    const { sessionID, accessTokenID, sub } =
      this.jwt.decode<RefreshTokenPayload>(refreshToken);
    const newAccessTokenID = v7();
    const refreshTokenID = v7();
    const atPayload: AccessTokenPayload = {
      jti: newAccessTokenID,
      sub: accountID,
      tokenType: 'access',
      sessionID,
      iat: Date.now(),
      ttl: parse('15min')!,
    };
    const rtPayload: RefreshTokenPayload = {
      jti: refreshTokenID,
      sub: accountID,
      tokenType: 'refresh',
      accessTokenID: newAccessTokenID,
      sessionID,
      iat: Date.now(),
      ttl: parse('1d')!,
    };
    const at = this.jwt.sign<AccessTokenPayload>(atPayload, {
      expiresIn: '15min',
    });
    const rt = this.jwt.sign<RefreshTokenPayload>(rtPayload, {
      expiresIn: '1d',
    });
    const disableResult = await this.sessionRepo.removeToken(
      sub,
      accessTokenID,
    );
    if (isErr(disableResult)) {
      return disableResult;
    }
    const putRes = await this.sessionRepo.putToken(atPayload, rtPayload);
    if (isErr(putRes)) {
      return putRes;
    }
    return ok({ accessToken: at, refreshToken: rt });
  }
}
