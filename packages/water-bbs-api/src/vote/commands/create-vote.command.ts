import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVoteResponse } from '../dto/create-vote.dto';
import { VoteRepository } from '../vote.repo';
import { Vote, VoteAction } from 'water-bbs-migration';

export class CreateVoteCommand extends Command<CreateVoteResponse> {
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
  async execute(command: CreateVoteCommand): Promise<CreateVoteResponse> {
    const vote = Vote.create(
      command.proposalId,
      command.accountId,
      command.action,
      command.comment,
    );
    await this.voteRepository.create(vote);
    return new CreateVoteResponse(vote.id);
  }
}
