import {
  CalculateVote,
  CreateProposal,
  FindProposal,
  ProposalId,
  CreateVote,
  ListProposal,
} from '@app/gamification';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateProposalDTO,
  CreateProposalResponseDTO,
} from './dto/create-proposal.dto';
import { AccountId } from 'src/auth';
import { ok } from 'neverthrow';
import { plainToInstance } from 'class-transformer';
import { FindProposalResponseDTO } from './dto/find-proposal.dto';
import { VoteKind, VoteProposalDTO } from './dto/vote-proposal.dto';
import { CursorDTO } from '@app/shared';

@Injectable()
export class ProposalService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createProposal(dto: CreateProposalDTO, creator: AccountId) {
    const createProposalResult = await this.commandBus.execute(
      new CreateProposal(
        dto.title,
        dto.steps,
        dto.content,
        dto.kind,
        creator,
        dto.proposalEndAt,
      ),
    );
    if (createProposalResult.isErr()) {
      return createProposalResult;
    }
    const proposal = await this.queryBus.execute(
      new FindProposal(createProposalResult.value),
    );
    if (proposal.isErr()) {
      return proposal;
    }
    return ok(plainToInstance(CreateProposalResponseDTO, proposal));
  }

  async findProposal(id: ProposalId) {
    const proposalResult = await this.queryBus.execute(new FindProposal(id));
    if (proposalResult.isErr()) {
      return proposalResult;
    }
    const proposal = proposalResult.value;
    const voteSummary = await this.queryBus.execute(
      new CalculateVote(proposal.id),
    );
    if (voteSummary.isErr()) {
      return voteSummary;
    }
    return ok(
      plainToInstance(FindProposalResponseDTO, {
        ...proposal,
        voteSummary,
      }),
    );
  }

  async vote(dto: VoteProposalDTO, actor: AccountId) {
    const result = await this.commandBus.execute(
      new CreateVote(dto.id, dto.kind === VoteKind.Agree, actor),
    );

    if (result.isErr()) {
      return result;
    }

    return ok({
      id: result.value,
    });
  }

  async listProposal(dto: CursorDTO) {
    const proposalListResult = await this.queryBus.execute(
      new ListProposal(dto.size, dto.cursor),
    );
    if (proposalListResult.isErr()) {
      return proposalListResult;
    }
    const proposalList = proposalListResult.value;
    return proposalList;
  }
}
