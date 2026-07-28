import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class UserNotExists extends DomainError {
  constructor() {
    super({
      key: 'exception.INTERNAL_ERROR',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
