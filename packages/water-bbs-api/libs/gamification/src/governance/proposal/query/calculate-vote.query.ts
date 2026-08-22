import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { ProposalId, ProposalSlot } from '../proposal.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ProposalNotFound } from '../error';

export type CalculateVoteResponse = {
  proposalId: ProposalId;
  yes: number;
  no: number;
};

export class CalculateVote extends Query<
  Result<CalculateVoteResponse, DomainError>
> {
  constructor(public readonly proposalId: ProposalId) {
    super();
  }
}

@QueryHandler(CalculateVote)
export class CalculateVoteService implements IQueryHandler<CalculateVote> {
  constructor(
    @InjectRepository(ProposalSlot)
    private readonly proposalSlotRepository: EntityRepository<ProposalSlot>,
  ) {}
  async execute(
    query: CalculateVote,
  ): Promise<Result<CalculateVoteResponse, DomainError>> {
    const proposal = await this.proposalSlotRepository.find({
      proposalId: query.proposalId,
    });
    if (!proposal) {
      return err(new ProposalNotFound());
    }
    const yes = proposal
      .map((p) => p.agreeCount)
      .reduce((pre, cur) => pre + cur, 0);
    const no = proposal
      .map((p) => p.disagreeCount)
      .reduce((pre, cur) => pre + cur, 0);
    return ok({ proposalId: proposal[0].id as unknown as ProposalId, yes, no });
  }
}
