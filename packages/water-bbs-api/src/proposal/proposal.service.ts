import { Injectable } from '@nestjs/common';
import { CreateProposal } from './dto/create-proposal.dto';
import { VoteAction } from 'water-bbs-migration';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateVoteCommand } from '../vote/commands/create-vote.command';
import { CreateProposalCommand } from './command/create-proposal.command';
import { GetProposalQuery } from './queries/get-proposal.query';
import { ListProposalsQuery } from './queries/list-proposals.query';

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
}
