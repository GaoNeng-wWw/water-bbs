import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { ReplyItem } from '../dto/find-reply.dto';
import { DomainError } from '@app/shared';
import { Reply, Topic, ReplyId } from '../entites';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Profile } from '../../auth';
import { EntityRepository } from '@mikro-orm/core';
import { ReplyNotFound } from '../errors';

export class GetReply extends Query<Result<ReplyItem, DomainError>> {
  constructor(public readonly id: ReplyId) {
    super();
  }
}

@QueryHandler(GetReply)
export class GetReplyService implements IQueryHandler<GetReply> {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: EntityRepository<Reply>,
    @InjectRepository(Profile)
    private readonly profileRepository: EntityRepository<Profile>,
    @InjectRepository(Topic)
    private readonly topicRepository: EntityRepository<Topic>,
  ) {}
  async execute({ id }: GetReply): Promise<Result<ReplyItem, DomainError>> {
    const topic = await this.replyRepository.findOne({
      id,
    });
    if (!topic) {
      return err(new ReplyNotFound(id));
    }
    const authorProfile = await this.profileRepository.findOne({
      accountId: topic.authorId,
    });
    if (!authorProfile) {
      return err(new ReplyNotFound(topic.id));
    }
    return ok(
      new ReplyItem({
        ...topic,
        author: {
          id: authorProfile.accountId,
          nick: authorProfile.nick,
        },
      }),
    );
  }
}
