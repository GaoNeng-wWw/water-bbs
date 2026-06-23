import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVoteResponse } from '../dto/create-vote.dto';
import { VoteRepository } from '../vote.repo';
import { Vote, VoteAction } from 'water-bbs-migration';
import {
  AppError,
  DomainError,
  err,
  isErr,
  ok,
  policyList,
  Result,
} from 'water-bbs-shared';
import { isEmpty } from 'radashi';
import { BankService } from '@app/bank';
import { PolicyService } from '@app/policy';

export class CreateVoteCommand extends Command<
  Result<CreateVoteResponse, AppError>
> {
  constructor(
    public proposalId: string,
    public accountId: string,
    public comment: string,
    public action: VoteAction,
  ) {
    super();
  }
}

@CommandHandler(CreateVoteCommand)
export class CreateVoteHandler implements ICommandHandler<CreateVoteCommand> {
  constructor(
    private readonly bankService: BankService,
    private readonly policyService: PolicyService,
    private readonly voteRepository: VoteRepository,
  ) {}
  async execute(
    command: CreateVoteCommand,
  ): Promise<Result<CreateVoteResponse, AppError>> {
    const existVote = await this.voteRepository.findVoteByActor(
      command.proposalId,
      command.accountId,
    );
    if (isErr(existVote)) {
      return existVote;
    }
    if (!isEmpty(existVote)) {
      return err(new DomainError('DUPLICATE_VOTE'));
    }
    const policyRes = await this.policyService.getPolicy(
      policyList.CreateVoteCostPolicy,
    );
    if (isErr(policyRes)) {
      return policyRes;
    }
    const { cost } = policyRes.value.value;
    const ensureResult = await this.bankService.ensureBalance(
      command.accountId,
      cost,
    );
    if (isErr(ensureResult)) {
      return ensureResult;
    }
    const vote = Vote.create(
      command.proposalId,
      command.accountId,
      command.action,
    );
    await this.voteRepository.create(vote);
    return ok(new CreateVoteResponse(vote.id));
  }
}
