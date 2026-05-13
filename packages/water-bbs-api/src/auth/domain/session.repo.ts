import { Inject } from '@nestjs/common';
import { AccessTokenPayload, RefreshTokenPayload } from './ar';
import { PersistenceError, Result } from 'water-bbs-shared';
import { AccountID } from 'src/account/domain';
export const SESSION_REPO_TOKEN = Symbol('SESSION_REPO_TOKEN');
export const InjectSessionRepo = () => Inject(SESSION_REPO_TOKEN);

export interface ISessionRepo {
  disabledToken(
    tokenId: string,
    accountId: string,
  ): Promise<Result<boolean, PersistenceError>>;
  getTokenTotal(
    accountID: AccountID,
  ): Promise<Result<number, PersistenceError>>;
  tokenAlive(
    accountID: string,
    tokenID: string,
  ): Promise<Result<boolean, PersistenceError>>;
  putToken(
    accessToken: AccessTokenPayload,
    refreshToken: RefreshTokenPayload,
  ): Promise<Result<number, PersistenceError>>;
}
