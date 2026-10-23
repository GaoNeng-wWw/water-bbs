import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TaskResetNever extends DomainError {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      key: 'exception.TASK_RESET_NEVER',
      details: {},
      args: {},
    });
  }
}