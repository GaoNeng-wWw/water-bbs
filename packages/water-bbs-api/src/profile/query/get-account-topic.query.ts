import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { AccountId } from '../../auth';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { EntityRepository } from '@mikro-orm/core';
import { Reply, Topic } from '../../topic';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProfileTopicInfo } from '../dto';
import { Category } from '../../category';

export class GetAccountPublishedTopic extends Query<
  Result<ProfileTopicInfo[], DomainError>
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
  }: GetAccountPublishedTopic): Promise<Result<ProfileTopicInfo[], DomainError>> {
    const topics = await this.topicRepo.find(
      { authorId: accountId },
      { limit: size, offset: page - 1 * size },
    );
    const redis = this.redisService.getOrThrow();
    const ret: ProfileTopicInfo[] = [];
    for (const topic of topics) {
      const category = await this.categoryRepo.findOne({
        id: topic.categoryId,
      });
      if (!category) {
        continue;
      }
      const repliesTotal = await redis.get(`topic:${topic.id}:replyTotal`);
      if (!repliesTotal) {
        continue;
      }
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
        new ProfileTopicInfo({
          ...topic,
          category,
          content: reply?.content ?? '',
          repliesTotal: Number(repliesTotal),
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
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
  ) {}
}
