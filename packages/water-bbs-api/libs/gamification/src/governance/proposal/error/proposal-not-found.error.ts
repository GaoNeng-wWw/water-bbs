import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class ProposalNotFound extends DomainError {
  constructor() {
    super({
      key: 'exception.PROPOSAL_NOT_FOUND',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
