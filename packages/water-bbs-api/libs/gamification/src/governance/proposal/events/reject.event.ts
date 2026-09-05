import { IEvent } from '@nestjs/cqrs';
import { ProposalId } from '../proposal.entity';

export class Reject implements IEvent {
  id = 'gamification.governance.proposal.reject';
  constructor(public readonly proposalId: ProposalId) {}
}
