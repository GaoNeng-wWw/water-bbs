import { v7 } from 'uuid';

export type SessionId = string & { readonly __brand: unique symbol };
export type Jti = string & { readonly __brand: unique symbol };
export const createJti = () => v7() as Jti;
export const createSessionId = () => v7() as SessionId;

export type BaseTokenData = {
  jti: Jti;
  sessionId: SessionId;
};
export type AccessTokenData = BaseTokenData & {
  sub: string;
  nonce: string;
};
export type RefreshTokenData = BaseTokenData & {
  sub: string;
  nonce: string;
  accessTokenJti: Jti;
};
export type TokenData = AccessTokenData | RefreshTokenData;
