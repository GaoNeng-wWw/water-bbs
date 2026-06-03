import { Inject } from '@nestjs/common';
import { DomainError, Result } from 'water-bbs-shared';
import { ZodType } from 'zod';

export const ACTION_HANDLER = Symbol('ACTION_HANDLER');

export const InjectActionHandler = () => Inject(ACTION_HANDLER);

export interface IActionHandler {
  name: string;
  schema: ZodType;
  validate(args: Record<string, any>):
    | {
        ok: true;
        error: undefined;
      }
    | {
        ok: false;
        error: DomainError;
      };
  run<T, E>(args: Record<string, any>): Promise<Result<T, E>>;
}
