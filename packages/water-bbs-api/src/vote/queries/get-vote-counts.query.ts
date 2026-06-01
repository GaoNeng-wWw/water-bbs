import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';
import { VoteService } from '../vote.service';

export type GetVoteCountResponse = { yes: number; total: number; no: number };

export class GetVoteCountQuery extends Query<
  Result<GetVoteCountResponse, AppError>
> {
  constructor(public proposalId: string) {
    super();
  }
}

@QueryHandler(GetVoteCountQuery)
export class GetVoteCountHandler implements IQueryHandler<GetVoteCountQuery> {
  constructor(private service: VoteService) {}
  async execute(
    query: GetVoteCountQuery,
  ): Promise<Result<GetVoteCountResponse, AppError>> {
    const totalRes = await this.service.getTotal(query.proposalId);
    if (isErr(totalRes)) {
      return totalRes;
    }
    return ok(totalRes.value);
  }
}
