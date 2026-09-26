import { Context, Definition, Handler, Step } from '@app/engine';
import { err, ok, Result } from 'neverthrow';
import z from 'zod';
import { CommentReply, ReplyId } from '../comment.entity';
import { CommentReplyNotFound } from '../error';

export const showCommentReplyDef = {
  key: 'comment.reply.show',
  param: z.object({
    replyId: z.string(),
  }),
  ui: [{ type: 'input', label: 'replyID', textType: 'text' }],
} satisfies Definition;

@Step(showCommentReplyDef)
export class ShowCommentReply implements Handler<typeof showCommentReplyDef> {
  async handle(
    param: { replyId: string },
    ctx: Context,
  ): Promise<Result<void, Error>> {
    const { em } = ctx;
    const id = param.replyId as ReplyId;
    const reply = await em.findOne(CommentReply, {
      id,
    });
    if (!reply) {
      return err(new CommentReplyNotFound(id));
    }
    reply.show();
    em.persist(reply);
    await em.flush();
    return ok();
  }
}
