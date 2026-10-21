import z from 'zod';
import { Field, IFieldProvider } from '../field.decorator';
import { InfraError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis as IRedis } from 'ioredis';

interface Redis extends IRedis {
  accountAlive: (uid: string) => Promise<boolean>;
}

export const UserLoggedSchema = z.object({
  accountID: z.string(),
});

@Field({ name: 'user.logged', schema: UserLoggedSchema })
export class UserLogged implements IFieldProvider<
  typeof UserLoggedSchema,
  boolean
> {
  constructor(private readonly redisSrv: RedisService) {}
  execute(params: {
    accountID: string;
  }): Promise<Result<boolean | null, InfraError>> {
    const redis = this.redisSrv.getOrThrow() as Redis;
    return redis.accountAlive(params.accountID).then((alive) => {
      return ok(!!alive);
    });
  }
}
