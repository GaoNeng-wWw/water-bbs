import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { TaskID, UserTask, UserTaskStatus } from '../../infra';
import { ApplicationError } from '@app/shared';
import { AccountId } from 'src/auth';
import { EntityManager } from '@mikro-orm/sqlite';
import { TaskNotFound } from '../error';
import { Task } from '../../schema';
import { TaskRunnerService } from '../runner';

export class DeliverTask extends Command<Result<TaskID, ApplicationError>> {
  constructor(
    public readonly accountID: AccountId,
    public readonly taskID: TaskID,
  ) {
    super();
  }
}

@CommandHandler(DeliverTask)
export class DeliverTaskService implements ICommandHandler<DeliverTask> {
  constructor(
    private em: EntityManager,
    private readonly taskRunner: TaskRunnerService,
  ) {}
  async execute({
    accountID,
    taskID,
  }: DeliverTask): Promise<Result<TaskID, ApplicationError>> {
    const userTask = await this.em.findOne(UserTask, {
      accountID,
      taskID,
      status: UserTaskStatus.Progress,
    });
    if (!userTask) {
      return err(new TaskNotFound());
    }
    const snapshot: Task = userTask.snapshot as Task;
    const result = await this.taskRunner.run(snapshot, accountID);
    if (result.isErr()) {
      return err(result.error.toApplicationError());
    }
    userTask.complete();
    this.em.persist(userTask);
    return ok(taskID);
  }
}
