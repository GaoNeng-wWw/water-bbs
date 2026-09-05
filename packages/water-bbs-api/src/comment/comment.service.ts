import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommentId, ReplyId } from './comment.entity';
import { RemoveComment, RemoveCommentReply } from './command';
import { err, ok } from 'neverthrow';
import { AccountId } from 'src/auth';
import { CreateCommentReplyRequest } from './dto';
import { CreateCommentReply } from './command/create-comment-reply.command';
import { GetReply } from './query';
import { Forbidden } from '@app/shared';

@Injectable()
export class CommentService {
  constructor(
    private readonly cb: CommandBus,
    private readonly qb: QueryBus,
  ) {}
  async removeComment(id: CommentId) {
    const commentResult = await this.cb.execute(new RemoveComment(id));
    if (commentResult.isErr()) {
      return commentResult;
    }
    const commentId = commentResult.value;
    return ok(commentId);
  }
  async createCommentReply(
    commentId: CommentId,
    request: CreateCommentReplyRequest,
    accountId: AccountId,
  ) {
    const replyId = await this.cb.execute(
      new CreateCommentReply(commentId, request.content, accountId),
    );
    if (replyId.isErr()) {
      return replyId;
    }
    const reply = await this.qb.execute(new GetReply(replyId.value.id));
    return reply;
  }
  async removeCommentReply(id: ReplyId, accountId: AccountId) {
    const replyResult = await this.qb.execute(new GetReply(id));
    if (replyResult.isErr()) {
      return replyResult;
    }
    const reply = replyResult.value;
    if (reply.creator !== accountId) {
      return err(new Forbidden());
    }
    await this.cb.execute(new RemoveCommentReply(id));
    return ok({ id });
  }
}
