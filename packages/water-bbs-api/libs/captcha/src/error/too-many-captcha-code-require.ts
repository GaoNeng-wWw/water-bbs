import { ApplicationServiceError } from 'water-bbs-shared';

export class TooManyCaptchaRequire extends ApplicationServiceError {
  constructor(delay: number) {
    super('TOO_MANY_REQUIRE_CAPTCHA_CODE', 429, null, { delay });
  }
}
