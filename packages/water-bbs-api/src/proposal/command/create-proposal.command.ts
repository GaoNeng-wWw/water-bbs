import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Proposals } from 'water-bbs-migration';
import { AppError, ok, Result } from 'water-bbs-shared';
import {
  CreateProposal,
  CreateProposalResponse,
} from '../dto/create-proposal.dto';
import { ProposalRepository } from '../proposal.repo';

export class CreateProposalCommand extends Command<
  Result<CreateProposalResponse, AppError>
> {
  constructor(
    public dto: CreateProposal,
    public due: Date = new Date(),
    public actor: string,
  ) {
    super();
  }
}

@CommandHandler(CreateProposalCommand)
export class CreateProposalHandler implements ICommandHandler<CreateProposalCommand> {
  constructor(private readonly proposalRepo: ProposalRepository) {}

  async execute(
    command: CreateProposalCommand,
  ): Promise<Result<CreateProposalResponse, AppError>> {
    const proposal = Proposals.create(
      command.actor,
      JSON.stringify(command.dto.workflows),
      command.dto.content,
      new Date(),
      command.due,
      command.dto.title,
    );
    await this.proposalRepo.upsertProposal(proposal);
    return ok({ id: proposal.id });
  }
}
