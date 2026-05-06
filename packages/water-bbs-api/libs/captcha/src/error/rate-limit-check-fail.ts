import { ApplicationServiceError } from 'water-bbs-shared';

export class RateLimitCheckFail extends ApplicationServiceError {
  constructor(reason: Error) {
    super('RATE_LIMIT_CHECK_FAIL', 500, reason);
  }
}
