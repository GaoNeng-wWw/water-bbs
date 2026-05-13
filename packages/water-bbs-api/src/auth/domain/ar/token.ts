export type AccessTokenPayload = {
  jti: string;
  sub: string;
  sessionID: string;
  tokenType: 'access';
  iat: number;
  ttl: number;
};

export type RefreshTokenPayload = {
  jti: string;
  sub: string;
  tokenType: 'refresh';
  accessTokenID: string;
  sessionID: string;
  iat: number;
  ttl: number;
};

export type TokenIndex = {
  accessTokenID: string;
  refreshTokenID: string;
  createdAt: number;
  ttl: number;
};

export type Token = AccessTokenPayload | RefreshTokenPayload;
