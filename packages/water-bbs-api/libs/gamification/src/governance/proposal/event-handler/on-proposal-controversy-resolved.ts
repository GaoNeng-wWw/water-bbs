import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Approve, ProposalControversyResolvedEvent, Reject } from '../events';
import { Proposal, ProposalStatus } from '../proposal.entity';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { err } from 'neverthrow';
import { ProposalNotFound } from '../error';

@EventsHandler(ProposalControversyResolvedEvent)
export class OnProposalControversyResolved implements IEventHandler<ProposalControversyResolvedEvent> {
  constructor(
    private readonly eventbus: EventBus,
    @InjectRepository(Proposal)
    private readonly repo: EntityRepository<Proposal>,
  ) {}
  async handle(event: ProposalControversyResolvedEvent) {
    const proposal = await this.repo.findOne({ id: event.proposalId });
    if (!proposal) {
      return err(new ProposalNotFound());
    }
    if (proposal.status === ProposalStatus.Approved) {
      this.eventbus.publish(new Approve(proposal.id));
    }
    if (proposal.status === ProposalStatus.Rejected) {
      this.eventbus.publish(new Reject(proposal.id));
    }
    return;
  }
}
