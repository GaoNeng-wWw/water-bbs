import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Approve, EmergencyProposalCreated } from '../events';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Proposal } from '../proposal.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { err, ok } from 'neverthrow';
import { ProposalNotFound } from '../error';

@EventsHandler(EmergencyProposalCreated)
export class OnEmergencyProposalCreated implements IEventHandler<EmergencyProposalCreated> {
  constructor(
    @InjectRepository(Proposal)
    private readonly repo: EntityRepository<Proposal>,
    private readonly eventBus: EventBus
  ) {}
  async handle({ proposalId }: EmergencyProposalCreated) {
    const proposal = await this.repo.findOne({ id: proposalId });
    if (!proposal) {
      return err(new ProposalNotFound());
    }

    proposal.pending();
    const approveResult = proposal.approve();
    if (approveResult.isErr()) {
      return approveResult;
    }
    await this.repo.upsert(proposal);
    await this.eventBus.publish(new Approve(proposal.id));
    return ok();
  }
}
