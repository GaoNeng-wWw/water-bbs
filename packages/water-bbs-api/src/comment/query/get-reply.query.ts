import { DomainError } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { CommentReply, ReplyId } from '../comment.entity';
import { EntityManager } from '@mikro-orm/core';
import { CommentReplyNotFound } from '../error';
import { AccountId } from 'src/auth';

export type GetReplyResponse = {
  hasChildren: boolean;
  replyId: ReplyId;
  content: string;
  creator: AccountId;
};

export class GetReply extends Query<Result<GetReplyResponse, DomainError>> {
  constructor(public readonly replyId: ReplyId) {
    super();
  }
}

@QueryHandler(GetReply)
export class GetReplyService implements IQueryHandler<GetReply> {
  constructor(private readonly em: EntityManager) {}
  async execute(
    query: GetReply,
  ): Promise<Result<GetReplyResponse, DomainError>> {
    const { replyId } = query;
    const reply = await this.em.findOne(CommentReply, { id: replyId });
    if (!reply) {
      return err(new CommentReplyNotFound(query.replyId));
    }
    const children = await this.em.findOne(CommentReply, {
      parentId: replyId,
    });
    return ok({
      hasChildren: children !== null,
      replyId: reply.id,
      content: reply.content,
      creator: reply.creator,
    });
  }
}
