import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Comment,
  CommentId,
  CommentReply,
  ReplyId,
  ROOT_PATH,
} from '../comment.entity';
import { DomainError } from '@app/shared';
import { err, ok, Result } from 'neverthrow';
import { AccountId } from 'src/auth';
import { EntityManager } from '@mikro-orm/core';
import { CommentNotFound, CommentReplyNotFound } from '../error';

export type CreateCommandReplyResponse = {
  id: ReplyId;
};
export class CreateCommentReply extends Command<
  Result<CreateCommandReplyResponse, DomainError>
> {
  constructor(
    public readonly commentId: CommentId,
    public readonly content: string,
    public readonly accountId: AccountId,
    public readonly parentId?: ReplyId,
  ) {
    super();
  }
}

@CommandHandler(CreateCommentReply)
export class CreateCommentReplyService implements ICommandHandler<CreateCommentReply> {
  constructor(private readonly em: EntityManager) {}
  async execute({
    commentId,
    content,
    accountId,
    parentId,
  }: CreateCommentReply): Promise<
    Result<CreateCommandReplyResponse, DomainError>
  > {
    const comment = await this.em.findOne(Comment, { id: commentId });
    if (!comment) {
      return err(new CommentNotFound(commentId));
    }
    let path = ROOT_PATH;
    if (parentId) {
      const parentReply = await this.em.findOne(CommentReply, { id: parentId });
      if (!parentReply) {
        return err(new CommentReplyNotFound(parentId));
      }
      path = parentReply.path;
    }
    const reply = CommentReply.create({
      commentId: comment.id,
      content,
      creator: accountId,
      parentPath: path,
    });
    this.em.persist(reply);
    await this.em.flush();
    return ok({ id: reply.id });
  }
}
