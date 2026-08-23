import { IEvent } from '@nestjs/cqrs';
import { ProposalId } from '../proposal.entity';

export class EmergencyProposalCreated implements IEvent {
  id = 'governance.proposal.emergency.created';
  constructor(public readonly proposalId: ProposalId) {}
}
