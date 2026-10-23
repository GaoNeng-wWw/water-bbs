import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { InfraError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis as IRedis } from 'ioredis';

interface Redis extends IRedis {
  accountAlive: (uid: string) => Promise<boolean>;
}

export const UserLoggedSchema = z.object({});

@Field({ name: 'user.logged', schema: UserLoggedSchema })
export class UserLogged implements IFieldProvider<
  typeof UserLoggedSchema,
  boolean
> {
  constructor(private readonly redisSrv: RedisService) {}
  execute(
    _params: z.infer<typeof UserLoggedSchema>,
    context: FieldProviderContext,
  ): Promise<Result<boolean | null, InfraError>> {
    const redis = this.redisSrv.getOrThrow() as Redis;
    return redis.accountAlive(context.accountID).then((alive) => {
      return ok(!!alive);
    });
  }
}