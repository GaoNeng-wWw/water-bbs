import { Context, Definition, Handler, Step } from '@app/engine';
import { err, ok, Result } from 'neverthrow';
import z from 'zod';
import { CommentId, Comment } from '../comment.entity';
import { CommentNotFound } from '../error';
import { DomainError } from '@app/shared';

export const lockCommentStepDef = {
  key: 'comment.lock',
  param: z.object({
    commentId: z.string(),
    reason: z.string(),
  }),
  ui: [{ type: 'input', label: 'reason', textType: 'text' }],
} satisfies Definition;

@Step(lockCommentStepDef)
export class LockComment implements Handler<typeof lockCommentStepDef> {
  async handle(
    param: { commentId: string; reason: string },
    ctx: Context,
  ): Promise<Result<void, DomainError>> {
    const { em } = ctx;
    const id = param.commentId as CommentId;
    const comment = await em.findOne(Comment, { id, lockedAt: null });
    if (!comment) {
      return err(new CommentNotFound(id));
    }
    comment.lock(param.reason);
    await em.upsert(Comment, comment);
    return ok();
  }
}
