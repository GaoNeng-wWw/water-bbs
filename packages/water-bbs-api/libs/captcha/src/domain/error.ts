import { DomainError } from 'water-bbs-shared';

export class CaptchaAlreadyRevoked extends DomainError {
  constructor() {
    super('CAPTCHA_ALREADY_REVOKED');
    this.code = 400;
  }
}
