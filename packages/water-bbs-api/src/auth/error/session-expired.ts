import { ApplicationServiceError } from 'water-bbs-shared';

export class SessionExpired extends ApplicationServiceError {
  constructor() {
    super('SESSION_EXPIRED', 401);
  }
}
