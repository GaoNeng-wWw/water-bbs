import {
  ActionHandler,
  IActionHandler,
  InvalidArguments,
  ValidateResult,
} from '@app/workflow';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Post } from 'water-bbs-migration';
import { DomainError, err, ok, Result } from 'water-bbs-shared';
import z from 'zod';

export const hidePostActionSchema = z.object({
  id: z.string(),
  reason: z.string().optional(),
});

export const hidePostActionType = 'post.hide' as const;

@ActionHandler()
export class HiddenPostAction implements IActionHandler<
  typeof hidePostActionSchema
> {
  validate(args: Record<string, any>): ValidateResult {
    const result = hidePostActionSchema.safeParse(args);
    if (!result.success) {
      return { ok: false, error: new InvalidArguments(result.error) };
    }
    return { ok: true, error: undefined };
  }
  async run({
    id,
    reason,
  }: {
    id: string;
    reason?: string;
  }): Promise<Result<{ id: string }, DomainError>> {
    const post = await this.repo.findOne({ id }, { cache: true });
    if (!post) {
      return err(new DomainError('POST_NOT_FOUND'));
    }
    post.hide(reason ?? '', undefined, true);
    await this.repo.upsert(post);
    return ok({ id: post.id });
  }
  name?: string | undefined;
  schema: typeof hidePostActionSchema = hidePostActionSchema;
  constructor(
    @InjectRepository(Post)
    private readonly repo: EntityRepository<Post>,
  ) {}
}
