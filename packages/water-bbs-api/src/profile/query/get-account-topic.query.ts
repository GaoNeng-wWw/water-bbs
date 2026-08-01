import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { AccountId } from '../../auth';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { EntityRepository } from '@mikro-orm/core';
import { Reply, Topic } from '../../topic';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TopicInfo } from '../dto';

export class GetAccountPublishedTopic extends Query<
  Result<TopicInfo[], DomainError>
> {
  constructor(
    public readonly accountId: AccountId,
    public readonly page: number,
    public readonly size: number,
  ) {
    super();
  }
}

@QueryHandler(GetAccountPublishedTopic)
export class GetAccountPublishedTopicService implements IQueryHandler<GetAccountPublishedTopic> {
  async execute({
    accountId,
    size,
    page,
  }: GetAccountPublishedTopic): Promise<Result<TopicInfo[], DomainError>> {
    const topics = await this.topicRepo.find(
      { authorId: accountId },
      { limit: size, offset: page - 1 * size },
    );
    const ret: TopicInfo[] = [];
    for (const topic of topics) {
      const reply = await this.replyRepo.findOne(
        {
          topicId: topic.id,
        },
        {
          orderBy: {
            createdAt: 'asc',
          },
          fields: ['content'],
        },
      );
      ret.push(
        new TopicInfo({
          ...topic,
          content: reply?.content ?? '',
        }),
      );
    }
    return ok(ret);
  }
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Topic)
    private readonly topicRepo: EntityRepository<Topic>,
    @InjectRepository(Reply)
    private readonly replyRepo: EntityRepository<Reply>,
  ) {}
}
