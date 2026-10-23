import { AccountId } from 'src/auth';
import { TaskDefinition, TaskID, UserTask, UserTaskStatus } from '../../infra';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { ApplicationError } from '@app/shared';
import { EntityManager } from '@mikro-orm/core';
import { TaskNotFound } from '../error';

export class ClaimTask extends Command<Result<TaskID, ApplicationError>> {
  constructor(
    public readonly accountID: AccountId,
    public readonly taskID: TaskID,
  ) {
    super();
  }
}

@CommandHandler(ClaimTask)
export class ClaimTaskService implements ICommandHandler<ClaimTask> {
  constructor(private em: EntityManager) {}
  async execute(command: ClaimTask): Promise<Result<TaskID, ApplicationError>> {
    const { accountID, taskID } = command;
    const task = await this.em.findOne(TaskDefinition, {
      id: taskID,
    });
    if (!task) {
      return err(new TaskNotFound());
    }
    const userTaskRecord = await this.em.findOne(UserTask, {
      accountID,
      taskID,
    });
    if (userTaskRecord) {
      const claimResult = task.canClaim(userTaskRecord);
      if (claimResult.isErr()) {
        return err(claimResult.error.toApplicationError());
      }
    }
    const userTask = this.em.create(UserTask, {
      accountID,
      taskID,
      snapshot: task,
      status: UserTaskStatus.Progress,
    });
    this.em.persist(userTask);
    await this.em.flush();
    return ok(taskID);
  }
}
