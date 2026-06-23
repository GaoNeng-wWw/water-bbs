import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Proposals, TransactionDetail } from 'water-bbs-migration';
import { AppError, isErr, ok, policyList, Result } from 'water-bbs-shared';
import {
  CreateProposal,
  CreateProposalResponse,
} from '../dto/create-proposal.dto';
import { ProposalRepository } from '../proposal.repo';
import { BankService } from '@app/bank';
import { PolicyService } from '@app/policy';

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
  constructor(
    private readonly bankService: BankService,
    private readonly policyService: PolicyService,
    private readonly proposalRepo: ProposalRepository,
  ) {}

  async execute(
    command: CreateProposalCommand,
  ): Promise<Result<CreateProposalResponse, AppError>> {
    const policy = await this.policyService.getPolicy(
      policyList.CreateProposalCostPolicy,
    );
    if (isErr(policy)) {
      return policy;
    }
    const { cost } = policy.value.value;
    const ensureResult = await this.bankService.ensureBalance(
      command.actor,
      cost,
    );
    if (isErr(ensureResult)) {
      return ensureResult;
    }
    const proposal = Proposals.create(
      command.actor,
      JSON.stringify(command.dto.workflows),
      command.dto.content,
      new Date(),
      command.due,
      command.dto.title,
      cost,
    );
    await this.proposalRepo.upsertProposal(proposal);

    const transcationResult = await this.bankService.transactionToSystem(
      command.actor,
      cost,
      new TransactionDetail('proposal.create', { id: proposal.id }),
    );
    if (isErr(transcationResult)) {
      return transcationResult;
    }

    return ok({ id: proposal.id });
  }
}
