import { HttpStatus } from '@nestjs/common';
import { DomainError } from './error.base';

export class InternalError extends DomainError {
  constructor(reason?: any) {
    super({
      key: 'exception.INTERNAL_ERROR',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      details: { reason },
    });
  }
}
