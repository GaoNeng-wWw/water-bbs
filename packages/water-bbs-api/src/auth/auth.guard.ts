import { UnAuthorized } from '@app/shared';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TokenExpired, InvalidToken } from './errors';
import { AccountId, TokenData } from './entites';

export const PublicToken = Symbol('public');

export type AuthUser = {
  id: AccountId;
};

export type AuthRequest = Request & {
  user?: AuthUser;
};

export const Public = () => SetMetadata(PublicToken, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PublicToken, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const http = context.switchToHttp();
    const req: AuthRequest = http.getRequest();
    if (!req.headers['authorization']) {
      throw new UnAuthorized();
    }
    const token = this.getToken(req.headers['authorization'] ?? '');
    try {
      const verifyResult: TokenData = this.jwt.verify(token);
      if ('accessTokenJti' in verifyResult) {
        throw new InvalidToken();
      }

      req['user'] = {
        id: verifyResult.sub as AccountId,
      };
      return true;
    } catch (e) {
      const err = e as JsonWebTokenError;
      if (err instanceof TokenExpiredError) {
        throw new TokenExpired();
      }
      throw new InvalidToken(err);
    }
  }
  getToken(token: string) {
    return token.split(' ')[1];
  }
}
