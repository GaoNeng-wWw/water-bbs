import { ApplicationServiceError } from 'water-bbs-shared';

export class RequrieCaptcha extends ApplicationServiceError {
  constructor() {
    super('REQURIE_CAPTCHA', 400, null, {});
  }
}
