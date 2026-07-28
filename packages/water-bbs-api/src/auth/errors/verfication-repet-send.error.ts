import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class VerificationCodeRepetSend extends DomainError {
  constructor() {
    super({
      key: 'exception.VERFICATION_CODE_REPEAT_SEND',
      status: HttpStatus.TOO_MANY_REQUESTS,
    });
  }
}
