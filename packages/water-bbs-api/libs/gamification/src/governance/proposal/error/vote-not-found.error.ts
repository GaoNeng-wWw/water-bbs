import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class VoteNotFound extends DomainError {
  constructor() {
    super({
      key: 'exception.VOTE_NOT_FOUND',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
