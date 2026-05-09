import { Aggregate } from 'types-ddd';
import { DomainError, err, ok } from 'water-bbs-shared';

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

export type SessionProps = {
  sid: string;
  sub: string;
  status: 'ALIVE' | 'REVOKED';
  version: string;
  tokenIndex: TokenIndex[];
};

export class Session extends Aggregate<SessionProps> {
  constructor(props: SessionProps) {
    super(props);
  }

  static fromPOJO(data: Record<string, string>, tokenIndex: TokenIndex[]) {
    const keys = ['sid', 'sub', 'version', 'status'];
    for (const key of keys) {
      if (key in data) {
        continue;
      }
      return err(new DomainError('FIELD_MISSING', null, { key }));
    }
    const status = data.status.toLowerCase();
    if (status !== 'alive' && status !== 'revoked') {
      return err(new DomainError('INVALID_SESSION', null));
    }
    return ok(
      new Session({
        sid: data.sid,
        sub: data.sub,
        status: status.toUpperCase() as 'ALIVE' | 'REVOKED',
        version: data.version,
        tokenIndex,
      }),
    );
  }

  get total() {
    return this.props.tokenIndex.length;
  }

  popFirst() {
    const self = this.clone();
    self.props.tokenIndex.shift();
    return self;
  }
  removeTokenByAccessTokenID(accessTokenID: string) {
    const self = this.clone();
    self
      .set('tokenIndex')
      .to(
        self.get('tokenIndex').filter((t) => t.accessTokenID !== accessTokenID),
      );
    return self;
  }
  removeTokenByRefreshTokenID(refreshTokenID: string) {
    const self = this.clone();
    self
      .set('tokenIndex')
      .to(
        self
          .get('tokenIndex')
          .filter((t) => t.refreshTokenID !== refreshTokenID),
      );
    return self;
  }
  pushToken(
    accessTokenID: string,
    refreshTokenID: string,
    ttl: number,
    createdAt: number = Date.now(),
  ) {
    const self = this.clone();
    self
      .set('tokenIndex')
      .to(
        [
          ...this.get('tokenIndex'),
          { accessTokenID, refreshTokenID, createdAt, ttl },
        ].sort((a, b) => a.createdAt - b.createdAt),
      );
    return self;
  }
  isRevoked() {
    return this.get('status') === 'REVOKED';
  }
  revoke() {
    const self = this.clone();
    self.set('status').to('REVOKED', (val) => val === 'ALIVE');
    return self;
  }
  setVersion(version: string) {
    const self = this.clone();
    self.set('version').to(version);
    return self;
  }
  compareVersion(version: string) {
    return this.get('version') === version;
  }
  findToken(tokenID: string) {
    const tokenPair = this.props.tokenIndex.find(
      (ti) => ti.accessTokenID === tokenID || ti.refreshTokenID === tokenID,
    );
    return tokenPair;
  }
}
