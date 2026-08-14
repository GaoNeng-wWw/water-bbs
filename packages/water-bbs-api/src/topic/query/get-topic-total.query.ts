import { DomainError } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';
import { CategoryId } from '../../category';
import { EntityManager } from '@mikro-orm/core';
import { RedisService } from '@liaoliaots/nestjs-redis';

export class GetTopicTotalQuery extends Query<Result<number, DomainError>> {
  constructor(public readonly categoryId: CategoryId | null) {
    super();
  }
}

@QueryHandler(GetTopicTotalQuery)
export class GetTopicTotalService implements IQueryHandler<GetTopicTotalQuery> {
  async execute(
    query: GetTopicTotalQuery,
  ): Promise<Result<number, DomainError>> {
    const redis = this.redisSrv.getOrThrow();
    const total = await redis.get(
      query.categoryId
        ? `category:${query.categoryId}:topic-total`
        : `topic-total`,
    );
    if (!total) {
      return ok(0);
    }
    return ok(Number(total));
  }
  constructor(
    private readonly em: EntityManager,
    private readonly redisSrv: RedisService,
  ) {}
}
