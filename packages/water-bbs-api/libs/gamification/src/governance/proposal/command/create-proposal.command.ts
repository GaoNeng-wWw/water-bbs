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
import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { StepDiscoverService } from '@app/engine';

export class CreateProposal extends Command<Result<ProposalId, DomainError>> {
  constructor(
    public title: string,
    public steps: ProposalStep[],
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
    private readonly eventBus: EventBus,
    private readonly stepRegistry: StepDiscoverService,
  ) {}
  async execute({
    title,
    steps,
    kind,
    creator,
    endedAt,
  }: CreateProposal): Promise<Result<ProposalId, DomainError>> {
    const proposal = this.proposalRepository.create({
      title,
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
