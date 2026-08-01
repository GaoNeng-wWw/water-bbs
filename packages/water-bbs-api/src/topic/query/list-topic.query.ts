import { ok, Result } from 'neverthrow';
import { Reply, Topic, TopicId } from '../entites';
import { DomainError } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { CategoryId } from '../../category';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { AccountId, Profile } from '../../auth';
import { RedisService } from '@liaoliaots/nestjs-redis';

export type AuthorInfo = {
  id: AccountId;
  nick: string;
};

export type TopicInfo = {
  id: TopicId;
  title: string;
  createdAt: Date;
  content: string;
  author: AuthorInfo;
  pinned: boolean;
  replyTotal: number;
};

export type ListTopicResult = {
  topics: TopicInfo[];
};

export class ListTopicQuery extends Query<
  Result<ListTopicResult, DomainError>
> {
  constructor(
    public readonly categoryId: CategoryId,
    public readonly page: number,
    public readonly size: number,
  ) {
    super();
  }
}

@QueryHandler(ListTopicQuery)
export class ListTopicService implements IQueryHandler<ListTopicQuery> {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: EntityRepository<Topic>,
    @InjectRepository(Profile)
    private readonly profileRepository: EntityRepository<Profile>,
    @InjectRepository(Reply)
    private readonly replyRepository: EntityRepository<Reply>,
    private readonly redisSrv: RedisService,
  ) {}
  async execute({
    categoryId,
    page,
    size,
  }: ListTopicQuery): Promise<Result<ListTopicResult, DomainError>> {
    const redis = this.redisSrv.getOrThrow();
    const items: TopicInfo[] = [];
    const topics = await this.topicRepository.find(
      {
        categoryId: categoryId,
      },
      {
        offset: (page - 1) * size,
        limit: size,
        orderBy: {
          pinned: 'desc',
        },
      },
    );
    for (const topic of topics) {
      const author = await this.profileRepository.findOne({
        accountId: topic.authorId,
      });
      if (!author) {
        continue;
      }
      const reply = await this.replyRepository.findOne(
        {
          topicId: topic.id,
        },
        {
          orderBy: {
            createdAt: 'asc',
          },
        },
      );
      if (!reply) {
        continue;
      }
      const total = await redis.get(`topic:${topic.id}:reply`);
      items.push({
        id: topic.id,
        title: topic.title,
        createdAt: topic.createdAt,
        content: reply.content,
        author: {
          id: topic.authorId,
          nick: author.nick,
        },
        pinned: topic.pinned,
        replyTotal: !total ? 0 : Number(total),
      });
    }
    return ok({ topics: items });
  }
}
