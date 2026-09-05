import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmergencyProposalCreated } from '../events';
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
  ) {}
  async handle({ proposalId }: EmergencyProposalCreated) {
    const proposal = await this.repo.findOne({ id: proposalId });
    if (!proposal) {
      return err(new ProposalNotFound());
    }
    // TODO: 通知BD
    return ok();
  }
}
