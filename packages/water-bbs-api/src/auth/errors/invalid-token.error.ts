import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class InvalidToken extends DomainError {
  constructor(cause?: Error) {
    super({
      key: 'exception.INVALID_TOKEN',
      cause,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
