import { IEvent } from '@nestjs/cqrs';
import { ProposalId } from '../proposal.entity';
import { AccountId } from 'src/auth';
import { MemberId } from '../../member';

export class ProposalControversyResolvedEvent implements IEvent {
  id = 'gamification.governance.proposal.controversy.resolved';
  constructor(
    public readonly proposalId: ProposalId,
    public readonly actorId: AccountId,
    public readonly memberId: MemberId,
    public readonly approve: boolean,
  ) {}
}
