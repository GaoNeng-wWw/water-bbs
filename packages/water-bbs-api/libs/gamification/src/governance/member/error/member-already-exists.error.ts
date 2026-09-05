import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class MemberAlreadyExists extends DomainError {
  constructor() {
    super({
      status: HttpStatus.CONFLICT,
      key: 'exception.MEMBER_ALREADY_EXISTS',
    });
  }
}
