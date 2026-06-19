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
  Result,
} from 'water-bbs-shared';
import { isEmpty } from 'radashi';

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
  constructor(private readonly voteRepository: VoteRepository) {}
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
    const vote = Vote.create(
      command.proposalId,
      command.accountId,
      command.action,
    );
    await this.voteRepository.create(vote);
    return ok(new CreateVoteResponse(vote.id));
  }
}
