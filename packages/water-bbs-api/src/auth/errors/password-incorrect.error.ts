import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class PasswordIncorrect extends DomainError {
  constructor() {
    super({
      key: 'exception.PASSWORD_INCORRECT',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
