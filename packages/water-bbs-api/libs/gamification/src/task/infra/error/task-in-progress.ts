import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TaskInProgress extends DomainError {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      key: 'exception.TASK_IN_PROGRESS',
      details: {},
      args: {},
    });
  }
}