import {
  ActionHandler,
  IActionHandler,
  InvalidArguments,
  ValidateResult,
} from '@app/workflow';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Post } from 'water-bbs-migration';
import { DomainError, err, ok, Result } from 'water-bbs-shared';
import z from 'zod';

export const schema = z.object({
  id: z.string(),
});

export type ShowPostActionSchema = z.infer<typeof schema>;
export const showPostActionName = 'post.show';

@ActionHandler()
export class ShowPostAction implements IActionHandler<ShowPostActionSchema> {
  async run({ id }: ShowPostActionSchema): Promise<Result<unknown, unknown>> {
    const post = await this.postRepository.findOne({ id }, { cache: true });
    if (!post) {
      return err(new DomainError('POST_NOT_FOUND'));
    }
    post.show();
    await this.postRepository.upsert(post);
    return ok({ id: post.id });
  }
  validate(args: Record<string, any>): ValidateResult {
    const result = schema.safeParse(args);
    if (!result.success) {
      return {
        ok: false,
        error: new InvalidArguments(result.error),
      };
    }
    return {
      ok: true,
      error: undefined,
    };
  }

  type: string = showPostActionName;
  getName(): string {
    return this.type;
  }
  schema = schema;

  constructor(
    @InjectRepository(Post)
    private postRepository: EntityRepository<Post>,
  ) {}
}
