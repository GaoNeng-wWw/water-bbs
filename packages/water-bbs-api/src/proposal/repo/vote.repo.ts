import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Vote } from 'water-bbs-migration';
import { err, ok, PersistenceError } from 'water-bbs-shared';

@Injectable()
export class VoteRepository {
  constructor(
    @InjectRepository(Vote)
    private voteRepo: EntityRepository<Vote>,
  ) {}

  create(vote: Vote) {
    return this.voteRepo
      .insert(vote)
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
  listVote(pid: string, page: number, size: number = 20) {
    return this.voteRepo.findAll({
      where: {
        proposalId: pid,
      },
      limit: size,
      offset: Math.max(page - 1, 0) * size,
    });
  }
}
