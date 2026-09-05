import { DomainError } from '@app/shared';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { CommentId, CommentReply, ReplyId } from '../comment.entity';
import { EntityManager } from '@mikro-orm/core';
import { CommentReplyNotFound } from '../error';

export type RemoveCommentReplyResponse = {
  replyId: ReplyId;
  commentId: CommentId;
};

export class RemoveCommentReply extends Command<
  Result<RemoveCommentReplyResponse, DomainError>
> {
  constructor(public readonly replyId: ReplyId) {
    super();
  }
}

@CommandHandler(RemoveCommentReply)
export class RemoveCommentReplyService implements ICommandHandler<RemoveCommentReply> {
  constructor(private readonly em: EntityManager) {}
  async execute(
    command: RemoveCommentReply,
  ): Promise<Result<RemoveCommentReplyResponse, DomainError>> {
    const reply = await this.em.findOne(CommentReply, { id: command.replyId });
    if (!reply) {
      return err(new CommentReplyNotFound(command.replyId));
    }
    reply._remove();
    this.em.persist(reply);
    await this.em.flush();
    return ok({
      replyId: reply.id,
      commentId: reply.commentId,
    });
  }
}
