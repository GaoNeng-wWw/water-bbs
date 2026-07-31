import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TokenExpired extends DomainError {
  constructor() {
    super({
      key: 'exception.TOKEN_EXPIRED',
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
