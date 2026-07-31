import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Reply, ReplyId, Topic, TopicId } from '../entites';
import { AccountId, Profile } from '../../auth';
import { err, ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TopicNotFound } from '../errors';

export interface ReplyAuthor {
  id: AccountId;
  nick: string;
  bio?: string;
}

export interface ReplyItem {
  id: ReplyId;
  content: string;
  author: ReplyAuthor;
  createdAt: Date;
}

export interface ListReplyResult {
  replies: ReplyItem[];
}

export class ListReplyQuery extends Query<
  Result<ListReplyResult, DomainError>
> {
  constructor(
    public readonly topicId: TopicId,
    public readonly page: number,
    public readonly size: number,
  ) {
    super();
  }
}

@QueryHandler(ListReplyQuery)
export class ListReplyService implements IQueryHandler<ListReplyQuery> {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: EntityRepository<Reply>,
    @InjectRepository(Profile)
    private readonly profileRepository: EntityRepository<Profile>,
    @InjectRepository(Topic)
    private readonly topicRepository: EntityRepository<Topic>,
  ) {}
  async execute({
    topicId,
    page,
    size,
  }: ListReplyQuery): Promise<Result<ListReplyResult, DomainError>> {
    const topic = await this.topicRepository.findOne({
      id: topicId,
    });
    if (!topic) {
      return err(new TopicNotFound(topicId));
    }
    const items: ReplyItem[] = [];
    const replies = await this.replyRepository.find(
      {
        topicId: topicId,
      },
      {
        offset: (page - 1) * size,
        limit: size,
      },
    );
    for (const reply of replies) {
      const profile = await this.profileRepository.findOne({
        accountId: reply.authorId,
      });
      if (!profile) {
        continue;
      }
      items.push({
        author: {
          id: profile.accountId,
          nick: profile.nick,
          bio: profile.bio,
        },
        content: reply.content,
        id: reply.id,
        createdAt: reply.createdAt,
      });
    }
    return ok({ replies: items });
  }
}
