import { ProposalCreated } from '@app/gamification';
import { EntityManager } from '@mikro-orm/core';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Comment, ResourceKind } from '../comment.entity';

@EventsHandler(ProposalCreated)
export class CreateProposalComment implements IEventHandler<ProposalCreated> {
  constructor(private readonly em: EntityManager) {}
  async handle(event: ProposalCreated): Promise<void> {
    const { proposalId } = event;
    const proposal = this.em.create(Comment, {
      resourceId: proposalId,
      resourceKind: ResourceKind.Proposal,
    });
    this.em.persist(proposal);
    await this.em.flush();
  }
}
