import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { TaskID, UserTask, UserTaskStatus } from '../../infra';
import { ApplicationError } from '@app/shared';
import { AccountId } from 'src/auth';
import { EntityManager } from '@mikro-orm/core';
import { TaskNotFound } from '../error';

export class CancelTask extends Command<Result<TaskID, ApplicationError>> {
  constructor(
    public readonly accountID: AccountId,
    public readonly taskID: TaskID,
  ) {
    super();
  }
}

@CommandHandler(CancelTask)
export class CancelTaskService implements ICommandHandler<CancelTask> {
  constructor(private em: EntityManager) {}
  async execute({
    accountID,
    taskID,
  }: CancelTask): Promise<Result<TaskID, ApplicationError>> {
    const userTask = await this.em.findOne(UserTask, {
      accountID,
      taskID,
      status: UserTaskStatus.Progress,
    });
    if (!userTask) {
      return err(new TaskNotFound());
    }
    const cancelResult = userTask.cancel();
    if (cancelResult?.isErr()) {
      return cancelResult;
    }
    this.em.persist(userTask);
    return ok(taskID);
  }
}
