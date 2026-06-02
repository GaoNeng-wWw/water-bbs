import { Inject } from '@nestjs/common';
import { DomainError, Result } from 'water-bbs-shared';

export const ACTION_HANDLER = Symbol('ACTION_HANDLER');

export const InjectActionHandler = () => Inject(ACTION_HANDLER);

export interface ActionHandler {
  name: string;
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
