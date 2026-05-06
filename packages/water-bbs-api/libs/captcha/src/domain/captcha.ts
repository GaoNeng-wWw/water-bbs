import { randomBytes } from 'crypto';
import { Aggregate, Fail, Ok } from 'types-ddd';
import { CaptchaAlreadyRevoked } from './error';

export enum Channel {
  Email,
}

export type TextCaptchaProp = {
  value: string;
  sub: string;
  ttl: number;
  create_at: number;
  revoked: boolean;
  channel: Channel;
};

export class Captcha extends Aggregate<TextCaptchaProp> {
  constructor(prop: TextCaptchaProp) {
    super(prop);
  }
  static build(sub: string, channel: Channel) {
    return new Captcha({
      value: randomBytes(32).toString('hex').toLowerCase().slice(0, 8),
      sub,
      // 5 Minutes
      ttl: 5 * 60,
      create_at: Date.now(),
      revoked: false,
      channel,
    });
  }
  valid(input: string) {
    return this.get('value') === input;
  }
  revoke() {
    if (this.get('revoked')) {
      return Fail(new CaptchaAlreadyRevoked());
    }
    this.set('revoked').to(true);
    return Ok();
  }
}
