import { IEvent } from '@nestjs/cqrs';
import { ProposalId } from '../proposal.entity';

export class Controversy implements IEvent {
  id = 'gamification.governance.proposal.controversy';
  constructor(public readonly proposalId: ProposalId) {}
}
