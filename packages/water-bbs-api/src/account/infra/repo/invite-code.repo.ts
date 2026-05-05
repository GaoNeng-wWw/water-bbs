import { RedisService } from '@nestjs-redisx/core';
import { Injectable } from '@nestjs/common';
import { IInviteCode } from 'src/account/domain/repo/invite-code.repo';
import { Result, PersistenceError, ok, err } from 'water-bbs-shared';

@Injectable()
export class InviteCodeRepository implements IInviteCode {
  constructor(private readonly redis: RedisService) {}
  save(code: string): Promise<Result<string, PersistenceError>> {
    // 7d
    return this.redis
      .setex(`invite-code:${code}`, 60 * 24 * 7, '1')
      .then(() => ok(code))
      .catch((reason) => err(new PersistenceError(reason, { reason })));
  }
  remove(code: string): Promise<Result<string, PersistenceError>> {
    return this.redis
      .del(`invite-code:${code}`)
      .then(() => ok(code))
      .catch((reason) => err(new PersistenceError(reason, { reason })));
  }
  exists(code: string): Promise<Result<boolean, PersistenceError>> {
    return this.redis
      .exists(`invite-code:${code}`)
      .then((status) => ok(Boolean(status)))
      .catch((reason) => err(new PersistenceError(reason, { reason })));
  }
}
