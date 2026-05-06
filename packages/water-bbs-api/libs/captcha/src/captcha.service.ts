import {
  type IRateLimitService,
  RATE_LIMIT_SERVICE,
} from '@nestjs-redisx/rate-limit';
import { Inject, Injectable } from '@nestjs/common';
import { Captcha, Channel, type CaptchaStore } from './domain';
import {
  ApplicationServiceError,
  err,
  isErr,
  isSome,
  ok,
  Result,
  unwrapResult,
} from 'water-bbs-shared';
import {
  TooManyCaptchaRequire,
  CaptchaNotFound,
  RateLimitCheckFail,
} from './error';

@Injectable()
export class CaptchaService {
  constructor(
    @Inject(RATE_LIMIT_SERVICE)
    private rateLimitService: IRateLimitService,
    private captchaRepository: CaptchaStore,
  ) {}
  async sendCaptcha(
    sub: string,
    channel: Channel,
  ): Promise<Result<boolean, ApplicationServiceError>> {
    const captcha = Captcha.build(sub, channel);
    const res = await this.rateLimitService
      .check(`captcha:send:${sub}:${channel}`, {
        algorithm: 'sliding-window',
        points: 1,
        duration: 60,
      })
      .then((res) => ok(res))
      .catch((reason) => err(new RateLimitCheckFail(reason)));
    if (isErr(res)) {
      return res;
    }
    const checkStatus = unwrapResult(res);
    if (!checkStatus.allowed) {
      return err(
        new TooManyCaptchaRequire(Math.ceil(checkStatus.retryAfter! / 1000)),
      );
    }
    return this.captchaRepository.upsert(captcha);
  }

  async verify(code: string, sub: string, channel: Channel) {
    const handle = await this.captchaRepository.get(sub, channel);
    if (isErr(handle)) {
      return handle;
    }
    const status = unwrapResult(handle);
    if (isSome(status)) {
      return ok(status.value.valid(code));
    }
    return err(new CaptchaNotFound());
  }
}
