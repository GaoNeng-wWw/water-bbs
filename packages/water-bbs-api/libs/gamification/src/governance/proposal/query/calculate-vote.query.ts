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
    if (!proposal.length) {
      return err(new ProposalNotFound());
    }
    const result = await this.proposalSlotRepository
      .getEntityManager()
      .getConnection()
      .execute(
        `
    SELECT
      proposal_id,
      SUM(agree_count) AS yes,
      SUM(disagree_count) AS no
    FROM proposal_slot
    WHERE proposal_id = ?
    GROUP BY proposal_id
    `,
        [query.proposalId],
      );
    if (result.length === 0) {
      return err(new ProposalNotFound());
    }

    return ok({
      proposalId: query.proposalId,
      yes: Number(result[0].yes),
      no: Number(result[0].no),
    });
  }
}
