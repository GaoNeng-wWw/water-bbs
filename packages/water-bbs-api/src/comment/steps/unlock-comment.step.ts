import { Context, Definition, Handler, Step } from '@app/engine';
import { err, ok, Result } from 'neverthrow';
import z from 'zod';
import { CommentId, Comment } from '../comment.entity';
import { CommentNotFound } from '../error';

export const unlockCommentStepDef = {
  key: 'comment.unlock',
  param: z.object({
    commentId: z.string(),
  }),
  ui: [
    { type: 'input', label: 'commentID', textType: 'text', id: 'commentId' },
  ],
} satisfies Definition;

@Step(unlockCommentStepDef)
export class UnlockComment implements Handler<typeof unlockCommentStepDef> {
  async handle(
    param: { commentId: string },
    ctx: Context,
  ): Promise<Result<void, Error>> {
    const { em } = ctx;
    const id = param.commentId as CommentId;
    const comment = await em.findOne(Comment, { id });
    if (!comment) {
      return err(new CommentNotFound(id));
    }
    if (comment.isLocked()) {
      comment.unlock();
      await em.upsert(Comment, comment);
    }
    return ok();
  }
}
