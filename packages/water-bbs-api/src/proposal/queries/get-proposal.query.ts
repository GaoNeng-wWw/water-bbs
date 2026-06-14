import { IQueryHandler, Query, QueryBus, QueryHandler } from '@nestjs/cqrs';
import {
  AppError,
  DomainError,
  err,
  isErr,
  ok,
  Result,
} from 'water-bbs-shared';
import { FindProfileByAccountIDQuery } from '../../account/queries';
import { GetVoteCountQuery } from '../../vote/queries/get-vote-counts.query';
import { AuthorProfile, ProposalEntity } from '../entity/propsal.entity';
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
    const profile = await this.queryBus.execute(
      new FindProfileByAccountIDQuery(res.value.authorId),
    );
    if (isErr(profile)) {
      return profile;
    }
    const authorProfile = new AuthorProfile(
      profile.value.id,
      profile.value.nick,
      profile.value.avatar,
      profile.value.bio,
    );
    const voteCount = await this.queryBus.execute(
      new GetVoteCountQuery(query.id),
    );
    if (isErr(voteCount)) {
      return voteCount;
    }
    const { yes, no } = voteCount.value;
    return ok(
      new ProposalEntity(query.id, authorProfile, res.value.content, yes, no),
    );
  }
}
