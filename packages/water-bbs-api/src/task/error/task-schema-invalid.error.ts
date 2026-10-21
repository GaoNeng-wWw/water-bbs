import { ApplicationError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TaskSchemaInvalidError extends ApplicationError {
  constructor(message: string) {
    super({
      key: 'exception.INVALID_TASK_SCHEMA',
      args: { message },
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
