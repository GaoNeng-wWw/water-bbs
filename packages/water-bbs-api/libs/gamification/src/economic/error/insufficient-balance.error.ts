import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class InsufficientBalance extends DomainError {
  constructor() {
    super({
      key: 'exception.INSUFFICIENT_BALANCE',
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
