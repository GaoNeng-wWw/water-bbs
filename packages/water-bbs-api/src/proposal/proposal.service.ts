import { Injectable } from '@nestjs/common';
import { CreateProposal } from './dto/create-proposal.dto';
import { ProposalRepository } from './proposal.repo';
import { Proposals, VoteAction } from 'water-bbs-migration';
import { err, isErr, ok } from 'water-bbs-shared';
import { Pagination } from '@app/shared';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindProfileByAccountIDQuery } from '../account/queries';
import { AuthorProfile, ProposalEntity } from './entity/propsal.entity';
import { ProposalSummary } from './entity/proposal-summary.entity';
import { GetVoteCountQuery } from '../vote/queries/get-vote-counts.query';
import { CreateVoteCommand } from 'src/vote/commands/create-vote.command';

@Injectable()
export class ProposalService {
  constructor(
    private proposalRepo: ProposalRepository,
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}
  createProposal(dto: CreateProposal, actor: string) {
    const proposal = Proposals.create(
      actor,
      JSON.stringify(dto.workflows),
      dto.content,
      new Date(),
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );
    return this.proposalRepo
      .upsertProposal(proposal)
      .then(() => ok({ id: proposal.id }));
  }
  votingProposal(
    proposalId: string,
    action: VoteAction,
    actor: string,
    comment: string,
  ) {
    return this.commandBus.execute(
      new CreateVoteCommand(proposalId, actor, comment, action),
    );
  }
  async getProposal(id: string) {
    const res = await this.proposalRepo.findProposal(id);
    if (isErr(res)) {
      return res;
    }
    if (!res.value) {
      return err(new Error('proposal not found'));
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
    if (!res.value) {
      return err(new Error('content is empty'));
    }
    const voteCount = await this.queryBus.execute(new GetVoteCountQuery(id));
    if (isErr(voteCount)) {
      return voteCount;
    }
    const { yes, no } = voteCount.value;
    return ok(
      new ProposalEntity(id, authorProfile, res.value.content, yes, no),
    );
  }
  async listProposals(page: number, size: number) {
    const data = await this.proposalRepo.listProposal(page, false, size);
    if (isErr(data)) {
      return data;
    }
    const [proposals, total] = data.value;
    return ok(
      new Pagination(
        total,
        proposals.map((p) => new ProposalSummary(p.id, p.content)),
      ),
    );
  }
}
