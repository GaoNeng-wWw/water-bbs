import { PersistenceError } from 'water-bbs-shared';

export class AccountNotFound extends PersistenceError {
  message = 'ACCOUNT_NOT_FOUND';
  constructor(parent?: Error) {
    super(parent);
  }
}
