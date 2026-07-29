import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class UserNotExists extends DomainError {
  constructor() {
    super({
      key: 'exception.USER_NOT_FOUND',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
