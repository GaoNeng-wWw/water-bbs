import { IEvent } from '@nestjs/cqrs';
import { ProposalId } from '../proposal.entity';

export class Approve implements IEvent {
  id = 'gamification.governance.proposal.approve';
  constructor(public readonly proposalId: ProposalId) {}
}
