import { HttpStatus } from '@nestjs/common';
import { DomainError } from './error.base';

export class UnAuthorized extends DomainError {
  constructor() {
    super({
      key: 'exception.UNAUTHORIZED',
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
