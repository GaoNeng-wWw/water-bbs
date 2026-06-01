import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';
import { VoteService } from '../vote.service';
import { VoteResponse } from '../dto/list-vote.dto';

export type ListVoteResponse = {
  data: VoteResponse[];
  total: number;
};

export class ListVoteQuery extends Query<Result<ListVoteResponse, AppError>> {
  constructor(
    public proposalId: string,
    public page: number = 1,
    public size: number = 20,
  ) {
    super();
  }
}

@QueryHandler(ListVoteQuery)
export class ListVoteHandler implements IQueryHandler<ListVoteQuery> {
  constructor(private service: VoteService) {}
  async execute(
    query: ListVoteQuery,
  ): Promise<Result<ListVoteResponse, AppError>> {
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
