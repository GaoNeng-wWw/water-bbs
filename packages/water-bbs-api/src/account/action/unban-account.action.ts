import {
  IActionHandler,
  InvalidArguments,
  ValidateResult,
  ActionHandler,
} from '@app/workflow';
import { QueryBus } from '@nestjs/cqrs';
import { DomainError, err, isErr, ok, Result } from 'water-bbs-shared';
import z, { ZodType } from 'zod';
import { AccountAliveQuery } from '../queries';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

const unbanAccountSchema = z.object({
  accountId: z.string(),
});

@ActionHandler()
export class UnbanAccountAction implements IActionHandler<
  typeof unbanAccountSchema
> {
  private readonly redis: Redis;
  constructor(
    private readonly qb: QueryBus,
    redisService: RedisService,
  ) {
    this.redis = redisService.getOrThrow();
  }
  getName(): string {
    return this.type;
  }
  validate(args: Record<string, any>): ValidateResult {
    const result = this.schema.safeParse(args);
    if (result.success) {
      return { ok: true, error: undefined };
    }
    return { ok: false, error: new InvalidArguments(result.error) };
  }
  async run(args: {
    accountId: string;
  }): Promise<Result<unknown, DomainError>> {
    const { accountId } = args;
    const accountAliveRes = await this.qb.execute(
      new AccountAliveQuery(accountId),
    );
    if (isErr(accountAliveRes)) {
      const child = accountAliveRes.error;
      return err(new DomainError(child.message, child));
    }
    await this.redis.del(`ban:${accountId}`);
    return ok(true);
  }
  type: string = 'UnbanAccount';
  schema: ZodType = unbanAccountSchema;
}
