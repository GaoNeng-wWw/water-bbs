export type AccessTokenPayload = {
  jti: string;
  sub: string;
  sessionID: string;
  tokenType: 'access';
};

export type RefreshTokenPayload = {
  jti: string;
  sub: string;
  tokenType: 'refresh';
  accessTokenID: string;
  sessionID: string;
};

export type TokenIndex = {
  accessTokenID: string;
  refreshTokenID: string;
  createdAt: number;
  ttl: number;
};
