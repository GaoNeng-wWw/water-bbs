import { ok, Result } from 'neverthrow';
import { Reply, Topic, TopicId } from '../entites';
import { DomainError } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { CategoryId } from '../../category';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { AccountId, Profile } from '../../auth';

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
  ) {}
  async execute({
    categoryId,
    page,
    size,
  }: ListTopicQuery): Promise<Result<ListTopicResult, DomainError>> {
    const items: TopicInfo[] = [];
    const topics = await this.topicRepository.find(
      {
        categoryId: categoryId,
      },
      {
        offset: (page - 1) * size,
        limit: size,
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
      items.push({
        id: topic.id,
        title: topic.title,
        createdAt: topic.createdAt,
        content: reply.content,
        author: {
          id: topic.authorId,
          nick: author.nick,
        },
      });
    }
    return ok({ topics: items });
  }
}
