import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class NotActiveMember extends DomainError {
  constructor() {
    super({
      key: 'exception.INTERNAL_ERROR',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
