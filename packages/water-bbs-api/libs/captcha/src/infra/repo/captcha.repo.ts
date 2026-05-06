import { Injectable } from '@nestjs/common';
import { CaptchaStore, Captcha, Channel } from '../../domain';
import {
  Result,
  PersistenceError,
  Option,
  ok,
  err,
  none,
  some,
  isErr,
} from 'water-bbs-shared';
import { RedisService } from '@nestjs-redisx/core';
import { isEmpty } from 'radashi';

@Injectable()
export class CaptchaRepository implements CaptchaStore {
  constructor(private readonly redis: RedisService) {}
  async upsert(captcha: Captcha): Promise<Result<boolean, PersistenceError>> {
    const ret = this.redis
      .hmset(
        `captcha:${captcha.get('sub')}:${captcha.get('channel')}`,
        captcha.toObject(),
      )
      .then(() => ok(true))
      .catch((reason) => err(new PersistenceError(reason, { reason })));
    const expireHandle = await this.redis
      .expire(
        `captcha:${captcha.get('sub')}:${captcha.get('channel')}`,
        captcha.get('ttl'),
      )
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason, { reason })));
    const lockState = await this.redis
      .set(`captcha:${captcha.get('sub')}:${captcha.get('channel')}`, '1', {
        ex: 60,
      })
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason, { reason })));
    if (isErr(lockState)) {
      this.redis
        .del(`captcha:${captcha.get('sub')}:${captcha.get('channel')}`)
        .then(ok)
        .catch(() => {});
      return lockState;
    }
    if (isErr(expireHandle)) {
      this.redis
        .del(`captcha:${captcha.get('sub')}:${captcha.get('channel')}`)
        .then(ok)
        .catch(() => {});
      return expireHandle;
    }
    return ret;
  }
  get(
    sub: string,
    channel: Channel,
  ): Promise<Result<Option<Captcha>, PersistenceError>> {
    return this.redis
      .hgetall(`captcha:${sub}:${channel}`)
      .then((obj) => {
        if (isEmpty(obj)) {
          return ok(none);
        }
        // TODO: 目前只有Email一个Channel
        const channel = Channel.Email;
        const captcha = new Captcha({
          create_at: Number(obj.create_at),
          revoked: obj.revoked === 'true',
          ttl: Number(obj.ttl),
          value: obj.value,
          sub: obj.sub,
          channel,
        });
        return ok(some(captcha));
      })
      .catch((reason) => err(new PersistenceError(reason, { reason })));
  }
}
