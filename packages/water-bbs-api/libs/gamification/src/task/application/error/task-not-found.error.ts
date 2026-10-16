import { ApplicationError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TaskNotFound extends ApplicationError {
  constructor() {
    super({
      key: 'exception.TASK_NOT_FOUND',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
