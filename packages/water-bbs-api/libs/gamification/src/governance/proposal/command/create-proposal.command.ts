import { AccountId } from 'src/auth';
import {
  Proposal,
  ProposalId,
  ProposalKind,
  ProposalStatus,
  ProposalStep,
} from '../proposal.entity';
import { DomainError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

export class CreateProposal extends Command<Result<ProposalId, DomainError>> {
  constructor(
    public title: string,
    public steps: ProposalStep[],
    public content: string,
    public kind: ProposalKind,
    public creator: AccountId,
    public endedAt?: Date,
  ) {
    super();
  }
}

@CommandHandler(CreateProposal)
export class CreateProposalService implements ICommandHandler<CreateProposal> {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: EntityRepository<Proposal>,
  ) {}
  async execute({
    title,
    steps,
    kind,
    creator,
    endedAt,
    content,
  }: CreateProposal): Promise<Result<ProposalId, DomainError>> {
    const proposal = this.proposalRepository.create({
      title,
      content,
      creator,
      steps,
      kind,
      startAt: new Date(),
      expiredAt: endedAt || new Date(),
      status: ProposalStatus.Pending,
    });
    const em = this.proposalRepository.getEntityManager();
    await em.transactional(async (em: EntityManager) => {
      em.persist(proposal);
      if (kind === ProposalKind.Emergency) {
        proposal.emergency();
        em.persist(proposal);
      }
      await em.flush();
    });
    return ok(proposal.id);
  }
}
