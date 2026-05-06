import { ApplicationServiceError } from 'water-bbs-shared';

export class CaptchaNotFound extends ApplicationServiceError {
  constructor() {
    super('CAPTCHA_NOT_FOUND', 404);
  }
}
