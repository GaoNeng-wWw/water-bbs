import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ProposalId, Vote } from '../proposal.entity';
import { ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { AccountId } from 'src/auth';
import { EntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';

export type AccountVoteResult = Record<ProposalId, number>;

export class CountAccuountVote extends Query<
  Result<AccountVoteResult, DomainError>
> {
  constructor(
    public readonly accountId: AccountId,
    public readonly proposalId?: ProposalId,
  ) {
    super();
  }
}

@QueryHandler(CountAccuountVote)
export class CountAccountVoteService implements IQueryHandler<CountAccuountVote> {
  constructor(
    @InjectRepository(Vote)
    private readonly repo: EntityRepository<Vote>,
  ) {}
  async execute({
    accountId,
    proposalId,
  }: CountAccuountVote): Promise<Result<AccountVoteResult, DomainError>> {
    const result = await this.repo.find({
      accountId,
      proposalId,
    });
    if (!result.length) {
      return ok({});
    }
    const ret: Record<ProposalId, number> = {};
    for (const res of result) {
      if (ret[res.proposalId] === undefined) {
        ret[res.proposalId] = 0;
      } else {
        ret[res.proposalId] += 1;
      }
    }
    return ok(ret);
  }
}
