import { raw } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Vote, VoteAction, VoteSlot } from 'water-bbs-migration';
import { err, ok, PersistenceError } from 'water-bbs-shared';
import { isEmpty } from 'radashi';

@Injectable()
export class VoteRepository {
  constructor(
    @InjectRepository(Vote)
    private voteRepo: EntityRepository<Vote>,
    @InjectRepository(VoteSlot)
    private voteSlotRepo: EntityRepository<VoteSlot>,
    private em: EntityManager,
  ) {}

  findVoteByActor(proposalId: string, actorId: string) {
    return this.em
      .find(
        Vote,
        {
          accountId: actorId,
          proposalId,
        },
        { cache: true },
      )
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
  create(vote: Vote) {
    return this.em
      .transactional(async (em) => {
        await em.insert(Vote, vote);
        await em.insert(
          VoteSlot,
          VoteSlot.create(
            vote.id,
            vote.proposalId,
            Math.floor(Math.random() * 32),
            vote.action,
          ),
        );
        return vote.id;
      })
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
  listVote(pid: string, page: number, size: number = 20) {
    return this.voteRepo
      .findAndCount(
        {
          proposalId: pid,
        },
        {
          limit: size,
          offset: Math.max(page - 1, 0) * size,
          cache: true,
        },
      )
      .then((data) => {
        const [votes, total] = data;
        return ok({ data: votes, total });
      })
      .catch((reason) => err(new PersistenceError(reason)));
  }
  countVotesByProposal(proposalId: string, action: VoteAction) {
    const qb = this.voteSlotRepo.createQueryBuilder();
    return qb
      .select([raw('sum(cnt) as cnt')])
      .where({ proposalId, action })
      .execute('get')
      .then((result) => {
        if (!result || isEmpty(result.cnt)) {
          return ok(0);
        }
        return ok(
          typeof result.cnt === 'number'
            ? result.cnt
            : (Number.parseInt(result.cnt) ?? 0),
        );
      })
      .catch((reason) => err(new PersistenceError(reason)));
  }
}
