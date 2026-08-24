import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Proposal, ProposalId, ProposalStatus } from '../proposal.entity';
import { err, ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { EntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProposalNotFound } from '../error';

type ProposalStep = {
  stepName: string;
  param: Record<string, any>;
};

export type ProposalInfo = {
  id: ProposalId;
  title: string;
  step: ProposalStep[];
  createdAt: string;
  status: ProposalStatus;
  content: string;
};

export class FindProposal extends Query<Result<ProposalInfo, DomainError>> {
  constructor(public readonly proposalId: ProposalId) {
    super();
  }
}

@QueryHandler(FindProposal)
export class FindProposalService implements IQueryHandler<FindProposal> {
  constructor(
    @InjectRepository(Proposal)
    private repo: EntityRepository<Proposal>,
  ) {}
  async execute(
    query: FindProposal,
  ): Promise<Result<ProposalInfo, DomainError>> {
    const proposal = await this.repo.findOne({
      id: query.proposalId,
    });
    if (!proposal) {
      return err(new ProposalNotFound());
    }
    return ok({
      id: proposal.id,
      title: proposal.title,
      step: proposal.steps,
      createdAt: proposal.createdAt.toString(),
      status: proposal.status,
      content: proposal.content,
    });
  }
}
