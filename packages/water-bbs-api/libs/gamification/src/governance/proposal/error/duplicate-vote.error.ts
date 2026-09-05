import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class DuplicateVote extends DomainError {
  constructor() {
    super({
      key: 'exception.DUPLICATE_VOTE',
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
