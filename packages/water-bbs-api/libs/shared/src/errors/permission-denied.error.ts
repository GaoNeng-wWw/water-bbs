import { HttpStatus } from '@nestjs/common';
import { DomainError } from './error.base';

export class PermissionDeniedError extends DomainError {
  constructor() {
    super({
      key: 'exception.PERMISSION_DENIED',
      status: HttpStatus.FORBIDDEN,
    });
  }
}
