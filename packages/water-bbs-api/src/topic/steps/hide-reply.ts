import { Context, Definition, Handler, Step } from '@app/engine';
import { err, ok, Result } from 'neverthrow';
import z from 'zod';
import { Reply, ReplyId } from '../entites';
import { ReplyNotFound } from '../errors';
import { HiddenPeriod } from '@app/shared';

export const hideReplyDef = {
  key: 'reply.hide',
  events: [],
  param: z.object({
    replyId: z.string(),
    reason: z.string(),
    endAt: z.iso.datetime().optional(),
  }),
  ui: [{ type: 'input', label: 'replyID', textType: 'text' }],
} satisfies Definition;

@Step(hideReplyDef)
export class HideReply implements Handler<typeof hideReplyDef> {
  async handle(
    param: { replyId: ReplyId; reason: string; endAt?: string },
    ctx: Context<[]>,
  ): Promise<Result<void, Error>> {
    const { em } = ctx;
    const reply = await em.findOne(Reply, { id: param.replyId });
    if (!reply) {
      return err(new ReplyNotFound(param.replyId));
    }
    const hiddenPeriod = HiddenPeriod.create(
      param.reason,
      param.endAt ? new Date(param.endAt) : undefined,
    );
    if (hiddenPeriod.isErr()) {
      return hiddenPeriod;
    }
    reply.hiddenPeriod = hiddenPeriod.value;
    await em.upsert(Reply, reply);
    return ok();
  }
}
