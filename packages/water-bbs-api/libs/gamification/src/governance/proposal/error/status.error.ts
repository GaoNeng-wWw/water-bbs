import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';
import { ProposalStatus } from '../proposal.entity';

export class StatusError extends DomainError {
  constructor(exceptionStatus: ProposalStatus, currentStatus: ProposalStatus) {
    super({
      status: HttpStatus.BAD_REQUEST,
      key: 'exception.PROPOSAL_STATUS_MACHINE_TRANS_ERROR',
      details: { exceptionStatus, currentStatus },
    });
  }
}
