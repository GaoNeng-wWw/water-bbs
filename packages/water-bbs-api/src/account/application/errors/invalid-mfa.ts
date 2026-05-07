import { ApplicationServiceError } from 'water-bbs-shared';

export class InvalidMfa extends ApplicationServiceError {
  constructor() {
    super('INVALID_MFA');
  }
}
