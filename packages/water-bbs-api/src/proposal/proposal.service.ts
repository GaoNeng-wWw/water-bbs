import { Injectable } from '@nestjs/common';
import { CreateProposal } from './dto/create-proposal.dto';
import { VoteAction } from 'water-bbs-migration';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateVoteCommand } from '../vote/commands/create-vote.command';
import { CreateProposalCommand } from './command/create-proposal.command';
import { GetProposalQuery } from './queries/get-proposal.query';
import { ListProposalsQuery } from './queries/list-proposals.query';
import { ListProposalCommentQuery } from 'src/vote/queries';
import { isErr } from 'water-bbs-shared';
import { Pagination } from '@app/shared';
import { CreateProposalCommentCommand } from './command';
import { CreateProposalCommentDto } from './dto/create-proposal-comment.dto';
import { FindProposalCommentsQuery } from './queries';

@Injectable()
export class ProposalService {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}
  createProposal(dto: CreateProposal, actor: string) {
    return this.commandBus.execute(
      new CreateProposalCommand(
        dto,
        new Date(Date.now() + 1000 * 60 * 60 * 24),
        actor,
      ),
    );
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
    return this.queryBus.execute(new GetProposalQuery(id));
  }
  async listProposals(page: number, size: number) {
    return this.queryBus.execute(new ListProposalsQuery(page, size));
  }
  async listProposalVotes(id: string, page: number = 1, size: number = 10) {
    const resp = await this.queryBus.execute(
      new ListProposalCommentQuery(id, page, size),
    );
    if (isErr(resp)) {
      return resp;
    }
    const { data, total } = resp.value;
    return new Pagination(total, data);
  }
  createProposalComment(
    proposalId: string,
    dto: CreateProposalCommentDto,
    authorId: string,
  ) {
    return this.commandBus.execute(
      new CreateProposalCommentCommand(proposalId, dto.content, authorId),
    );
  }
  async findProposalComments(
    proposalId: string,
    page: number = 1,
    size: number = 10,
  ) {
    return this.queryBus.execute(
      new FindProposalCommentsQuery(proposalId, page, size),
    );
  }
}
