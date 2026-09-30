import { Context, Definition, Handler, Step } from '@app/engine';
import { err, ok, Result } from 'neverthrow';
import { z } from 'zod';
import { CommentReply, ReplyId } from '../comment.entity';

export const hideCommentReplyDef = {
  key: 'comment.reply.hide',
  param: z.object({
    replyId: z.string(),
    reason: z.string(),
    endAt: z.iso.datetime().optional(),
  }),
  ui: [
    { id: 'replyId', type: 'input', label: 'replyID', textType: 'text' },
    { id: 'reason', type: 'input', label: 'reason', textType: 'text' },
    { id: 'endAt', type: 'date-picker', label: 'endAt' },
  ],
} satisfies Definition;

@Step(hideCommentReplyDef)
export class HideCommentReply implements Handler<typeof hideCommentReplyDef> {
  async handle(
    param: { replyId: string; reason: string; endAt?: string },
    ctx: Context,
  ): Promise<Result<void, Error>> {
    const { em } = ctx;
    const reply = await em.findOne(CommentReply, {
      id: param.replyId as ReplyId,
    });
    if (!reply) {
      return err(new Error('回复不存在'));
    }
    reply.hidden(param.reason, param.endAt ? new Date(param.endAt) : undefined);
    em.persist(reply);
    await em.flush();
    return ok();
  }
}
