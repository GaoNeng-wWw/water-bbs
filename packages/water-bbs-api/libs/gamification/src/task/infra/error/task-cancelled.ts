import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TaskCancelled extends DomainError {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      key: 'exception.TASK_CANCELLED',
      details: {},
      args: {},
    });
  }
}
