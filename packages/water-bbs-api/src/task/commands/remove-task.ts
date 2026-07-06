import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainError, isErr, ok, Result } from 'water-bbs-shared';
import { RemoveTaskResponse } from '../dto/remove-task.dto';
import { TaskRegistry } from '@app/gamification';
import { EntityRepository } from '@mikro-orm/mysql';
import { UserTask } from 'water-bbs-migration';

export class RemoveTaskCommand extends Command<
  Result<RemoveTaskResponse, DomainError>
> {
  constructor(public readonly taskId: string) {
    super();
  }
}

@CommandHandler(RemoveTaskCommand)
export class RemoveTask implements ICommandHandler<RemoveTaskCommand> {
  constructor(
    private readonly taskRegistry: TaskRegistry,
    private readonly userTaskRepo: EntityRepository<UserTask>,
  ) {}
  async execute(
    command: RemoveTaskCommand,
  ): Promise<Result<RemoveTaskResponse, DomainError>> {
    const removeResult = await this.taskRegistry.removeTask(command.taskId);
    if (isErr(removeResult)) {
      return removeResult;
    }
    const taskId = removeResult.value;
    const tasks = await this.userTaskRepo.find({
      taskId,
    });
    tasks.forEach((task) => task.remove());
    await this.userTaskRepo.upsertMany(tasks);
    return ok(new RemoveTaskResponse({ id: taskId }));
  }
}
