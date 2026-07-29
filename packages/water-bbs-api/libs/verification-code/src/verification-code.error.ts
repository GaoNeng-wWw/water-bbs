import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class CodeNotFoundOrExpired extends DomainError {
  constructor() {
    super({
      key: 'exception.VERIFICATION_CODE_NOT_FOUND_OR_EXPIRED',
      status: HttpStatus.BAD_REQUEST,
    });
  }
}

export class RepeatSend extends DomainError {
  constructor() {
    super({
      key: 'exception.VERIFICATION_CODE_REPEAT_SEND',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
