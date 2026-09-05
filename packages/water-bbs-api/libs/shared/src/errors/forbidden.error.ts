import { HttpStatus } from '@nestjs/common';
import { DomainError } from './error.base';

export class Forbidden extends DomainError {
  constructor() {
    super({
      key: 'exception.FORBIDDEN',
      status: HttpStatus.FORBIDDEN,
    });
  }
}
