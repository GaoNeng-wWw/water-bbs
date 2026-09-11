import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';
import { CalculateVoteResponse } from './calculate-vote.query';
import { DomainError } from '@app/shared';
import { ProposalId } from '../proposal.entity';
import { EntityManager } from '@mikro-orm/sqlite';

export class BatchCalculateVote extends Query<
  Result<CalculateVoteResponse[], DomainError>
> {
  constructor(public readonly proposalId: ProposalId[]) {
    super();
  }
}

@QueryHandler(BatchCalculateVote)
export class BatchCalculateVoteService implements IQueryHandler<BatchCalculateVote> {
  constructor(private readonly em: EntityManager) {}
  async execute({
    proposalId,
  }: BatchCalculateVote): Promise<
    Result<CalculateVoteResponse[], DomainError>
  > {
    const result = await this.em.execute(
      `
SELECT
  proposal_id,
  SUM(agree_count) as yes,
  SUM(disagree_count) as no
FROM proposal_slot
WHERE proposal_id IN (?)
GROUP BY proposal_id
`,
      [proposalId],
    );
    return ok(result as CalculateVoteResponse[]);
  }
}
