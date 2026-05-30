import { Injectable } from '@nestjs/common';
import { CreateProposal } from './dto/create-proposal.dto';
import { ProposalRepository, VoteRepository } from './repo';
import { Proposals } from 'water-bbs-migration';
import { err, isErr, ok } from 'water-bbs-shared';
import { Pagination } from '@app/shared';
import { QueryBus } from '@nestjs/cqrs';
import { FindProfileByAccountIDQuery } from '../account/queries';
import { AuthorProfile, ProposalEntity } from './entity/propsal.entity';
import { ProposalSummary } from './entity/proposal-summary.entity';

@Injectable()
export class ProposalService {
  constructor(
    private proposalRepo: ProposalRepository,
    private voteRepo: VoteRepository,
    private queryBus: QueryBus,
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
    // TODO: 获取双方
    return ok(new ProposalEntity(id, authorProfile, res.value.content, 0, 0));
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
