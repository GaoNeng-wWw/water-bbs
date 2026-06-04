import { IActionHandler } from '@app/workflow';
import { ActionHandler } from '@app/workflow/action-handler.decorator';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { DomainError, ok, Result } from 'water-bbs-shared';
import z from 'zod';

const schema = z.object({
  accountId: z.string(),
  expiredAt: z.date(),
  reason: z.string().optional(),
});

@ActionHandler()
export class BanAccountAction implements IActionHandler<typeof schema> {
  name: string = 'account.ban';
  schema = schema;

  private readonly redis: Redis;
  constructor(redisService: RedisService) {
    this.redis = redisService.getOrThrow();
  }

  validate(
    args: Record<string, any>,
  ): { ok: true; error: undefined } | { ok: false; error: DomainError } {
    const { success, error } = this.schema.safeParse(args);
    if (!success) {
      return {
        ok: false,
        error: new DomainError('INVALID_ARGS', error, z.treeifyError(error)),
      };
    }
    return { ok: true, error: undefined };
  }
  async run(args: Record<string, any>): Promise<Result<boolean, DomainError>> {
    const accountId = args.accountId.toString();
    const expiredAt: Date = args.expiredAt;
    const reason = args.reason;
    await this.redis.hset(`ban:${accountId}`, {
      expiredAt: expiredAt.toISOString(),
      reason,
    });
    await this.redis.expireat(
      `ban:${accountId}`,
      expiredAt.getTime() / 1000,
      'NX',
    );
    return ok(true);
  }
}
