import { DomainError } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';
import { AccountId } from '../../auth';
import { EntityRepository } from '@mikro-orm/core';
import { Topic } from '../../topic';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RedisService } from '@liaoliaots/nestjs-redis';

export class GetAccountPublishedTopicTotal extends Query<
  Result<number, DomainError>
> {
  constructor(public readonly accountId: AccountId) {
    super();
  }
}

@QueryHandler(GetAccountPublishedTopicTotal)
export class GetAccountPublishedTopicTotalService implements IQueryHandler<GetAccountPublishedTopicTotal> {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepo: EntityRepository<Topic>,
    private readonly redisService: RedisService,
  ) {}
  async execute({
    accountId,
  }: GetAccountPublishedTopicTotal): Promise<Result<number, DomainError>> {
    const redis = this.redisService.getOrThrow();
    const topicTotal = await redis.get(`user:${accountId}:topic:total`);
    if (typeof topicTotal !== 'number') {
      return ok(await this.topicRepo.count({ authorId: accountId }));
    }
    return ok(Number(topicTotal));
  }
}
