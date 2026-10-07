import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TaskRewardParamParseError extends DomainError {
  constructor(message: string) {
    super({
      status: HttpStatus.BAD_REQUEST,
      key: 'exception.TASK_REWARD_PARAM_PARSE_ERROR',
      args: { message },
    });
  }
}
