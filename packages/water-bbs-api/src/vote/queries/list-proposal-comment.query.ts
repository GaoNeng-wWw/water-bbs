import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';
import { VoteService } from '../vote.service';
import { VoteComment } from '../dto/list-vote.dto';

export type ListProposalCommentResponse = {
  data: VoteComment[];
  total: number;
};

export class ListProposalCommentQuery extends Query<
  Result<ListProposalCommentResponse, AppError>
> {
  constructor(
    public proposalId: string,
    public page: number = 1,
    public size: number = 20,
  ) {
    super();
  }
}

@QueryHandler(ListProposalCommentQuery)
export class ListProposalComment implements IQueryHandler<ListProposalCommentQuery> {
  constructor(private service: VoteService) {}
  async execute(
    query: ListProposalCommentQuery,
  ): Promise<Result<ListProposalCommentResponse, AppError>> {
    const res = await this.service.listVotes(
      query.proposalId,
      query.page,
      query.size,
    );
    if (isErr(res)) {
      return res;
    }
    const { votes, total } = res.value;
    return ok({ data: votes, total });
  }
}
