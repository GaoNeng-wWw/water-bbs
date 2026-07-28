import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class UserExists extends DomainError {
  constructor() {
    super({
      key: 'exception.USER_EXISTS',
      status: HttpStatus.TOO_MANY_REQUESTS,
    });
  }
}
