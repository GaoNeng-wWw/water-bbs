import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { TopicAuthor, TopicInfo } from '../dto';
import { DomainError } from '@app/shared';
import { Reply, Topic, TopicId } from '../entites';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TopicNotFound } from '../errors';
import { Profile } from '../../auth';
import { RedisService } from '@liaoliaots/nestjs-redis';

export class GetTopicQuery extends Query<Result<TopicInfo, DomainError>> {
  constructor(public id: TopicId) {
    super();
  }
}

@QueryHandler(GetTopicQuery)
export class GetTopicService implements IQueryHandler<GetTopicQuery> {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: EntityRepository<Topic>,
    @InjectRepository(Reply)
    private readonly replyRepository: EntityRepository<Reply>,
    @InjectRepository(Profile)
    private readonly profileRepository: EntityRepository<Profile>,
    private readonly redisSrv: RedisService,
  ) {}

  async execute(query: GetTopicQuery): Promise<Result<TopicInfo, DomainError>> {
    const redis = this.redisSrv.getOrThrow();
    const total = await redis.get(`topic:${query.id}:replyTotal`);
    const topic = await this.topicRepository.findOne(query.id);
    if (!topic) {
      return err(new TopicNotFound(query.id));
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
      return err(new TopicNotFound(query.id));
    }
    const profile = await this.profileRepository.findOne({
      accountId: topic.authorId,
    });
    if (!profile) {
      return err(new TopicNotFound(query.id));
    }
    return ok(
      new TopicInfo({
        id: topic.id,
        title: topic.title,
        content: reply?.content ?? '',
        author: new TopicAuthor({
          id: topic.authorId,
          nick: profile.nick,
        }),
        createdAt: topic.createdAt,
        pinned: topic.pinned,
        replyTotal: !total ? 0 : Number(total),
      }),
    );
  }
}
