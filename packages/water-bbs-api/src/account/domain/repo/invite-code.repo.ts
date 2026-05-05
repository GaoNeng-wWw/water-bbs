import { Inject } from '@nestjs/common';
import { PersistenceError, Result } from 'water-bbs-shared';

export const InviteCodeRepositoryToken = Symbol('InviteCodeRepository');
export const InjectInviteCodeRepository = () =>
  Inject(InviteCodeRepositoryToken);

export interface IInviteCode {
  save(code: string): Promise<Result<string, PersistenceError>>;
  remove(code: string): Promise<Result<string, PersistenceError>>;
  exists(code: string): Promise<Result<boolean, PersistenceError>>;
}
