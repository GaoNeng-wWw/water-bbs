import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Proposals } from 'water-bbs-migration';
import { err, ok, PersistenceError } from 'water-bbs-shared';

@Injectable()
export class ProposalRepository {
  constructor(
    @InjectRepository(Proposals)
    private proposalRepo: EntityRepository<Proposals>,
    private em: EntityManager,
  ) {}

  upsertProposal(entity: Proposals) {
    return this.em
      .persist(entity)
      .flush()
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
  findProposal(pid: string) {
    return this.proposalRepo
      .findOne({ id: pid }, { cache: true })
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
  listProposal(
    page: number,
    includeRemoved: boolean = false,
    size: number = 20,
  ) {
    return this.proposalRepo
      .findAndCount(
        {},
        {
          offset: (page - 1) * size,
          limit: size,
          filters: includeRemoved
            ? { softDelete: false }
            : { softDelete: true },
        },
      )
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
}
