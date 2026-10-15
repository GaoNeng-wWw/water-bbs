import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class FieldParamError extends DomainError {
  constructor(message: string, cause?: Error) {
    super({
      status: HttpStatus.BAD_REQUEST,
      key: 'exception.FIELD_PARAM_ERROR',
      cause,
      args: { message },
    });
  }
}
