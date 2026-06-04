import {
  ActionHandler,
  IActionHandler,
  InvalidArguments,
  ValidateResult,
} from '@app/workflow';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { isEmpty } from 'class-validator';
import { Action } from 'water-bbs-migration';
import { DomainError, err, ok, Result } from 'water-bbs-shared';
import z from 'zod';

const schema = z.object({ id: z.string(), active: z.boolean() });

@ActionHandler()
export class UpdateActionActiveAction implements IActionHandler<typeof schema> {
  validate(args: Record<string, any>): ValidateResult {
    const result = schema.safeParse(args);
    if (!result.success) {
      return { ok: false, error: new InvalidArguments(result.error) };
    }
    return { ok: true, error: undefined };
  }
  async run(args: {
    id: string;
    active: boolean;
  }): Promise<Result<{ id: string }, DomainError>> {
    const { id, active } = args;
    const action = await this.repo.findOne({ id });
    if (!action || isEmpty(action)) {
      return err(new DomainError('action not found'));
    }
    if (active) {
      action.enable();
    } else {
      action.disable();
    }
    await this.repo.upsert(action);
    return ok({ id: action.id });
  }
  name: string = 'action.updateActive';
  schema: typeof schema = schema;
  constructor(
    @InjectRepository(Action)
    private readonly repo: EntityRepository<Action>,
  ) {}
}
