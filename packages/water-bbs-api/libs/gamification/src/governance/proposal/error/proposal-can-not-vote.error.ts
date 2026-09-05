import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class ProposalCannotVote extends DomainError {
  constructor() {
    super({
      key: 'exception.PROPOSAL_CAN_NOT_VOTE',
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
