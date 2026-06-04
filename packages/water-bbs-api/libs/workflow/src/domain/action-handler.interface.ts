import { Inject } from '@nestjs/common';
import { DomainError, Result } from 'water-bbs-shared';
import z, { ZodType } from 'zod';

export const ACTION_HANDLER = Symbol('ACTION_HANDLER');

export const InjectActionHandler = () => Inject(ACTION_HANDLER);

export type ValidateResult =
  | {
      ok: true;
      error: undefined;
    }
  | {
      ok: false;
      error: DomainError;
    };

export type IActionHandler<Schema> = {
  validate(args: Record<string, any>): ValidateResult;
  run(args: z.infer<Schema>): Promise<Result<unknown, unknown>>;
  name?: string;
  schema: ZodType;
};
