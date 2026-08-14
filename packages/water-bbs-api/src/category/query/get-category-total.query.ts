import { DomainError } from '@app/shared';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';

export class GetCategoryTotalQuery extends Query<Result<number, DomainError>> {
  constructor() {
    super();
  }
}

@QueryHandler(GetCategoryTotalQuery)
export class GetCategoryTotalService implements IQueryHandler<GetCategoryTotalQuery> {
  constructor(private readonly redisService: RedisService) {}
  async execute(): Promise<Result<number, DomainError>> {
    const redis = this.redisService.getOrThrow();
    return ok(Number(await redis.get('category:total')));
  }
}
