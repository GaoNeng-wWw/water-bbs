import { Inject } from '@nestjs/common';
import { Session } from './ar';
import { Option, PersistenceError, Result } from 'water-bbs-shared';
import { AccountID } from 'src/account/domain';
export const SESSION_REPO_TOKEN = Symbol('SESSION_REPO_TOKEN');
export const InjectSessionRepo = () => Inject(SESSION_REPO_TOKEN);

export interface ISessionRepo {
  upsert(session: Session): Promise<Result<boolean, PersistenceError>>;
  findAuthSessionBySessionID(
    sessionID: string,
  ): Promise<Result<Option<Session>, PersistenceError>>;
  findAuthSessionByAccountID(
    accountID: AccountID,
  ): Promise<Result<Option<Session>, PersistenceError>>;
  saveWithCas(
    accountID: string,
    exceptedVersion: string,
    session: Session,
    ttl: number,
  ): Promise<Result<string, PersistenceError>>;
}
