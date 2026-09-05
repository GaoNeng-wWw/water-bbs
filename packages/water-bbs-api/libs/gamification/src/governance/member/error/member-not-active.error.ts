import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class MemberNotActive extends DomainError {
  constructor() {
    super({
      key: 'exception.MEMBER_NOT_FOUND',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
