import { IQueryHandler, Query, QueryBus, QueryHandler } from '@nestjs/cqrs';
import {
  AppError,
  DomainError,
  err,
  isErr,
  ok,
  Result,
} from 'water-bbs-shared';
import { GetVoteCountQuery } from '../../vote/queries/get-vote-counts.query';
import { ProposalEntity } from '../entity/propsal.entity';
import { ProposalRepository } from '../proposal.repo';

export class GetProposalQuery extends Query<Result<ProposalEntity, AppError>> {
  constructor(public id: string) {
    super();
  }
}

@QueryHandler(GetProposalQuery)
export class GetProposalHandler implements IQueryHandler<GetProposalQuery> {
  constructor(
    private readonly proposalRepo: ProposalRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(
    query: GetProposalQuery,
  ): Promise<Result<ProposalEntity, AppError>> {
    const res = await this.proposalRepo.findProposal(query.id);
    if (isErr(res)) {
      return res;
    }
    if (!res.value) {
      return err(new DomainError('PROPOSAL_NOT_FOUND'));
    }
    const voteCount = await this.queryBus.execute(
      new GetVoteCountQuery(query.id),
    );
    if (isErr(voteCount)) {
      return voteCount;
    }
    const { yes, no } = voteCount.value;
    return ok(
      new ProposalEntity(query.id, res.value.title, res.value.reason, yes, no),
    );
  }
}
