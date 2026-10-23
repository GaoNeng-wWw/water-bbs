import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class FieldNotFound extends DomainError {
  constructor(name: string) {
    super({
      key: 'exception.FIELD_NOT_FOUND',
      args: { name },
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
