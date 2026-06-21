import { Injectable } from '@nestjs/common';
import { VoteRepository } from './vote.repo';
import { Vote, VoteAction } from 'water-bbs-migration';
import { isErr, ok } from 'water-bbs-shared';
import { CreateVoteDTO } from './dto/create-vote.dto';
import { VoteAuthor, VoteComment } from './dto/list-vote.dto';
import { QueryBus } from '@nestjs/cqrs';
import { FindProfileByAccountIDQuery } from 'src/account/application/queries';

@Injectable()
export class VoteService {
  constructor(
    private voteRepo: VoteRepository,
    private query: QueryBus,
  ) {}
  async getTotal(proposalId: string) {
    const yes = await this.voteRepo.countVotesByProposal(
      proposalId,
      VoteAction.Yes,
    );
    if (isErr(yes)) {
      return yes;
    }
    const no = await this.voteRepo.countVotesByProposal(
      proposalId,
      VoteAction.No,
    );
    if (isErr(no)) {
      return no;
    }
    const total = yes.value + no.value;
    return ok({ total, yes: yes.value, no: no.value });
  }
  async createVote(dto: CreateVoteDTO, accountId: string, yes: boolean) {
    const vote = Vote.create(
      dto.proposalId,
      accountId,
      yes ? VoteAction.Yes : VoteAction.No,
    );
    const createResp = await this.voteRepo.create(vote);
    if (isErr(createResp)) {
      return createResp;
    }
    const id = createResp.value;
    return { id };
  }
  async listVotes(proposalId: string, page: number = 1, size: number = 10) {
    const listRes = await this.voteRepo.listVote(proposalId, page, size);
    if (isErr(listRes)) {
      return listRes;
    }
    const { data, total } = listRes.value;
    const authorCache = new Map<string, VoteAuthor>();
    const votes: VoteComment[] = [];
    for (const vote of data) {
      const accountId = vote.accountId;
      if (!authorCache.has(accountId)) {
        const profileRes = await this.query.execute(
          new FindProfileByAccountIDQuery(accountId),
        );
        if (!profileRes || isErr(profileRes)) {
          authorCache.set(accountId, new VoteAuthor(accountId, '', ''));
        } else {
          authorCache.set(
            accountId,
            new VoteAuthor(
              accountId,
              profileRes.value.nick,
              profileRes.value.avatar || '',
            ),
          );
        }
      }
      const profile = authorCache.get(accountId)!;
      const ret = new VoteComment(profile, vote.createdAt.toLocaleString());
      votes.push(ret);
    }
    return ok({ votes, total });
  }
}
