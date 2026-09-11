import { Context, Definition, Handler, Step } from '@app/engine';
import { err, ok, Result } from 'neverthrow';
import z from 'zod';
import { Reply, ReplyId } from '../entites';
import { ReplyNotFound } from '../errors';

export const removeReplyDef = {
  key: 'topic.remove',
  events: [],
  param: z.object({
    replyId: z.string(),
  }),
  ui: [{ type: 'input', label: 'replyID', textType: 'text' }],
} satisfies Definition;

@Step(removeReplyDef)
export class RemoveReply implements Handler<typeof removeReplyDef> {
  async handle(
    param: { replyId: ReplyId },
    ctx: Context<[]>,
  ): Promise<Result<void, Error>> {
    const { em } = ctx;
    const reply = await em.findOne(Reply, { id: param.replyId });
    if (!reply) {
      return err(new ReplyNotFound(param.replyId));
    }
    reply.remove();
    await em.upsert(Reply, reply);
    return ok();
  }
}
