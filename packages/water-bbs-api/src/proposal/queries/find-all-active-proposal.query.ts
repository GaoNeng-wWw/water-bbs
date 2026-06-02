import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query } from '@nestjs/cqrs';
import { Proposals, ProposalStatus } from 'water-bbs-migration';
import { AppError, err, ok, PersistenceError, Result } from 'water-bbs-shared';

export class FindAllActiveProposalQuery extends Query<
  Result<{ id: string }[], AppError>
> {
  constructor() {
    super();
  }
}

export class FindAllActiveProposalQueryHandler implements IQueryHandler<FindAllActiveProposalQuery> {
  constructor(
    @InjectRepository(Proposals)
    private proposalRepo: EntityRepository<Proposals>,
  ) {}
  execute(): Promise<Result<{ id: string }[], AppError>> {
    return this.proposalRepo
      .findAll({
        where: {
          status: ProposalStatus.Active,
        },
        cache: true,
      })
      .then((proposals) => {
        return proposals.map((proposal) => ({
          id: proposal.id,
        }));
      })
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
}
