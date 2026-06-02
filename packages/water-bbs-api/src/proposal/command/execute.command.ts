import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AppError,
  DomainError,
  err,
  isErr,
  ok,
  Result,
} from 'water-bbs-shared';
import { ProposalDomainService } from '../proposal.domain.service';
import { ProposalRepository } from '../proposal.repo';

export class ExecuteProposalCommand extends Command<Result<boolean, AppError>> {
  constructor(
    public id: string,
    public yes: number,
    public no: number,
  ) {
    super();
  }
}

@CommandHandler(ExecuteProposalCommand)
export class ExecuteProposalHandler implements ICommandHandler<ExecuteProposalCommand> {
  constructor(
    private readonly proposalDomainService: ProposalDomainService,
    private readonly proposalRepository: ProposalRepository,
  ) {}
  async execute(
    command: ExecuteProposalCommand,
  ): Promise<Result<boolean, AppError>> {
    const proposalResult = await this.proposalRepository.findProposal(
      command.id,
    );
    if (isErr(proposalResult)) {
      return proposalResult;
    }
    const proposal = proposalResult.value;
    if (!proposal) {
      return err(new DomainError('PROPOSAL_NOT_FOUND'));
    }
    const runResult = await this.proposalDomainService.run(
      proposal,
      command.yes,
      command.no,
    );
    if (isErr(runResult)) {
      return runResult;
    }
    const upsertRes = await this.proposalRepository.upsertProposal(proposal);
    if (isErr(upsertRes)) {
      return upsertRes;
    }
    return ok(true);
  }
}
