import { DomainError } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';
import { TopicId } from '../entites';
import { EntityManager } from '@mikro-orm/core';
import { RedisService } from '@liaoliaots/nestjs-redis';

export class GetReplyTotalQuery extends Query<Result<number, DomainError>> {
  constructor(public readonly topicId: TopicId) {
    super();
  }
}

@QueryHandler(GetReplyTotalQuery)
export class GetReplyTotalService implements IQueryHandler<GetReplyTotalQuery> {
  constructor(
    private readonly em: EntityManager,
    private readonly redisSrv: RedisService,
  ) {}
  async execute(
    query: GetReplyTotalQuery,
  ): Promise<Result<number, DomainError>> {
    const redis = this.redisSrv.getOrThrow();
    const total = await redis.get(`topic:${query.topicId}:reply`);
    if (!total) {
      return ok(0);
    }
    return ok(Number(total));
  }
}
