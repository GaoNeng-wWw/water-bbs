import { DomainError } from '@app/shared';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { AccountId } from 'src/auth';
import { ProposalId, Vote, VoteKind } from '../proposal.entity';
import { EntityRepository } from '@mikro-orm/sqlite';
import { VoteNotFound } from '../error';

export class FindVoteByCreator extends Query<Result<VoteInfo, DomainError>> {
  constructor(public readonly creatorId: AccountId) {
    super();
  }
}

type VoteInfo = {
  kind: VoteKind;
  proposalId: ProposalId;
};

@QueryHandler(FindVoteByCreator)
export class FindVoteByCreatorService implements IQueryHandler<FindVoteByCreator> {
  constructor(
    @InjectRepository(Vote)
    private readonly repo: EntityRepository<Vote>,
  ) {}
  async execute({
    creatorId,
  }: FindVoteByCreator): Promise<Result<VoteInfo, DomainError>> {
    const vote = await this.repo.findOne({ accountId: creatorId });
    if (!vote) {
      return err(new VoteNotFound());
    }
    return ok({
      kind: vote.kind,
      proposalId: vote.proposalId,
    });
  }
}
