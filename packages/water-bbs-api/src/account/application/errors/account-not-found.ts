import { ApplicationServiceError } from 'water-bbs-shared';

export class AccountNotFound extends ApplicationServiceError {
  constructor() {
    super('ACCOUNT_NOT_FOUND', 404);
  }
}
