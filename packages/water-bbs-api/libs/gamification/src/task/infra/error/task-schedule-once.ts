import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TaskScheduleOnce extends DomainError {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      key: 'exception.TASK_SCHEDULE_ONCE',
      details: {},
      args: {},
    });
  }
}