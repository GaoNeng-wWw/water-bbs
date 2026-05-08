import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccessTokenPayload, RefreshTokenPayload } from 'src/auth/domain/ar';
import { TokenAliveQuery } from '../../../../src/auth/queries/token-alive.query';
import { isErr } from 'water-bbs-shared';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_FLAG } from '../decorator/is-public';

export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private query: QueryBus,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPub = this.reflector.get<boolean>(
      IS_PUBLIC_FLAG,
      context.getHandler(),
    );
    if (isPub) {
      return true;
    }
    const http = context.switchToHttp();
    const req: Request = http.getRequest();
    const authorization = req.headers.authorization || '';
    const token = this.getToken(authorization);
    if (!token) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    const tokenPayload = this.jwt.decode<
      AccessTokenPayload | RefreshTokenPayload
    >(token);
    if (tokenPayload.tokenType !== 'access') {
      throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
    }
    const sessionID = tokenPayload.sessionID;
    const tokenID = tokenPayload.jti;
    const handle = await this.query.execute(
      new TokenAliveQuery(sessionID, tokenID),
    );
    if (isErr(handle)) {
      throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
    }
    const alive = handle.value;
    if (!alive) {
      throw new HttpException('TOKEN_EXPIRED', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
  getToken(authorization: string) {
    const [token] = authorization.split(' ');
    return token;
  }
}
