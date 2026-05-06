import { ApplicationServiceError } from 'water-bbs-shared';

export class InvalidCaptcha extends ApplicationServiceError {
  constructor() {
    super('INVALID_CAPTCHA', 400, null, {});
  }
}
