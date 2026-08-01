import { ConfigureService } from '@app/configure';
import { randomAlphabet } from '@app/shared';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { err, ok } from 'neverthrow';
import { CodeNotFoundOrExpired, RepeatSend } from './verification-code.error';
import { Injectable } from '@nestjs/common';

export type VerifyContext = IssueContext & {
  code?: string;
};

export type IssueContext = {
  scene: string;
  receiver: string;
};

@Injectable()
export class VerificationCodeService {
  constructor(
    private readonly redis: RedisService,
    private readonly cfg: ConfigureService,
  ) {}
  async issue({ scene, receiver }: IssueContext) {
    const redis = this.redis.getOrThrow();
    const ttl = this.cfg.get('feature.verificationCodeTTL');
    const code = randomAlphabet(8);
    if (await redis.exists(`verification:${scene}:${receiver}`)) {
      return err(new RepeatSend());
    }
    await redis.set(`verification:${scene}:${receiver}`, code, 'EX', ttl);
    return ok(code);
  }
  async verify({ scene, receiver, code }: VerifyContext) {
    const redis = this.redis.getOrThrow();
    const realCode = await redis.get(`verification:${scene}:${receiver}`);
    if (!realCode || code !== realCode) {
      return err(new CodeNotFoundOrExpired());
    }
    return ok();
  }
}
