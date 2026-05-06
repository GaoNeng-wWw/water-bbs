import { Option, PersistenceError, Result } from 'water-bbs-shared';
import { Captcha, Channel } from './captcha';

export const CAPTCHA_REPOSITORY_TOKEN = Symbol('CAPTCHA_REPOSITORY');

export interface CaptchaStore {
  upsert(captcha: Captcha): Promise<Result<boolean, PersistenceError>>;
  get(
    sub: string,
    channel: Channel,
  ): Promise<Result<Option<Captcha>, PersistenceError>>;
}
