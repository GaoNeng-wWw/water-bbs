import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';
import { Pagination } from '@app/shared';
import { ProposalSummary } from '../entity/proposal-summary.entity';
import { ProposalRepository } from '../proposal.repo';
import { VoteRepository } from '../../vote/vote.repo';
import { VoteAction } from 'water-bbs-migration';

export class ListProposalsQuery extends Query<
  Result<Pagination<ProposalSummary>, AppError>
> {
  constructor(
    public page: number,
    public size: number,
  ) {
    super();
  }
}

@QueryHandler(ListProposalsQuery)
export class ListProposalsHandler implements IQueryHandler<ListProposalsQuery> {
  constructor(
    private readonly proposalRepo: ProposalRepository,
    private readonly voteRepo: VoteRepository,
  ) {}

  async execute(
    query: ListProposalsQuery,
  ): Promise<Result<Pagination<ProposalSummary>, AppError>> {
    const data = await this.proposalRepo.listProposal(
      query.page,
      false,
      query.size,
    );
    if (isErr(data)) {
      return data;
    }
    const [proposals, total] = data.value;
    const datas: ProposalSummary[] = [];
    for (const proposal of proposals) {
      const yesVote = await this.voteRepo.countVotesByProposal(
        proposal.id,
        VoteAction.Yes,
      );
      if (isErr(yesVote)) {
        return yesVote;
      }
      const noVote = await this.voteRepo.countVotesByProposal(
        proposal.id,
        VoteAction.No,
      );
      if (isErr(noVote)) {
        return noVote;
      }
      const total = yesVote.value + noVote.value;
      datas.push(
        new ProposalSummary(
          proposal.id,
          proposal.title,
          proposal.status,
          yesVote.value,
          noVote.value,
          total,
          proposal.createdAt.toISOString(),
          proposal.endAt.toISOString(),
        ),
      );
    }
    return ok(new Pagination(total, datas));
  }
}
