import { IEvent } from '@nestjs/cqrs';
import { ProposalId } from '../proposal.entity';

export class ProposalCreated implements IEvent {
  id = 'governance.proposal.created';
  constructor(public readonly proposalId: ProposalId) {}
}
