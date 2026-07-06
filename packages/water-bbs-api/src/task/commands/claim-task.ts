import { TaskService } from '@app/gamification';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainError, Result } from 'water-bbs-shared';

export class ClaimTaskCommand extends Command<
  Result<{ taskId: string }, DomainError>
> {
  constructor(
    public readonly accountId: string,
    public readonly taskId: string,
  ) {
    super();
  }
}

@CommandHandler(ClaimTaskCommand)
export class ClaimTask implements ICommandHandler<ClaimTaskCommand> {
  constructor(private readonly taskService: TaskService) {}
  async execute(
    command: ClaimTaskCommand,
  ): Promise<Result<{ taskId: string }, DomainError>> {
    return this.taskService.claim(command.taskId, command.accountId);
  }
}
