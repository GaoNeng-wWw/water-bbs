import { Injectable } from '@nestjs/common';
import { ActionHandler, InjectActionHandler } from './action-handler.interface';
import { IAction } from './action';
import { DomainError, Err, err, isErr, Result } from 'water-bbs-shared';
import { CanNotFoundHandlerError } from '../errors/can-not-found-handler';
import { ValidateFailError } from '../errors/validate-fail';

@Injectable()
export class WorkflowRunner {
  constructor(
    @InjectActionHandler()
    private handlers: ActionHandler[] = [],
  ) {}
  async execute<T>(
    action: IAction,
    param: Record<string, any> = {},
  ): Promise<Result<T, DomainError>> {
    const [handler] = this.handlers.filter((h) => h.name === action.type);
    if (!handler) {
      return err(new CanNotFoundHandlerError());
    }
    const { ok: isOk, error } = handler.validate(param);
    if (!isOk) {
      return err(new ValidateFailError(error));
    }
    let pre = await handler.run<T, DomainError>(param);
    if (!action.children.length) {
      return pre;
    }
    if (isErr(pre)) {
      return pre;
    }
    for (const child of action.children) {
      const res = await this.execute<T>(child, pre);
      if (isErr(res)) {
        return res as Err<DomainError>;
      }
      pre = res;
    }
    return pre;
  }
}
