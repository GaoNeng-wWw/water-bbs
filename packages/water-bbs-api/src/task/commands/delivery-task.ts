import { TaskService } from '@app/gamification';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainError, Result } from 'water-bbs-shared';

export class DeliveryTaskCommand extends Command<
  Result<{ taskId: string }, DomainError>
> {
  constructor(
    public readonly taskId: string,
    public readonly userId: string,
  ) {
    super();
  }
}

@CommandHandler(DeliveryTaskCommand)
export class DeliveryTask implements ICommandHandler<DeliveryTaskCommand> {
  constructor(private readonly taskService: TaskService) {}
  async execute({
    taskId,
    userId,
  }: DeliveryTaskCommand): Promise<Result<{ taskId: string }, DomainError>> {
    return this.taskService.complete(taskId, userId);
  }
}
