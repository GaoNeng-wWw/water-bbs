import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { TaskDefinition, TaskID, UserTask, UserTaskStatus } from '../../infra';
import { err, ok, Result } from 'neverthrow';
import { ApplicationError } from '@app/shared';
import { AccountId } from 'src/auth';
import { EntityManager } from '@mikro-orm/sqlite';
import { TaskNotFound } from '../error';
import { WhenNode } from '../../schema';

export type TaskDetail = {
  id: TaskID;
  name: string;
  desc?: string;
  icon?: string;
  canClaim: boolean;
  status: UserTaskStatus;
  condition: WhenNode[];
  claim?: WhenNode[];
};

export class GetTaskDetail extends Query<Result<TaskDetail, ApplicationError>> {
  constructor(
    public readonly taskID: TaskID,
    public readonly accountID: AccountId,
  ) {
    super();
  }
}

@QueryHandler(GetTaskDetail)
export class GetTaskDetailService implements IQueryHandler<GetTaskDetail> {
  constructor(private readonly em: EntityManager) {}
  async execute({
    taskID,
    accountID,
  }: GetTaskDetail): Promise<Result<TaskDetail, ApplicationError>> {
    const userTask = await this.em.findOne(UserTask, { accountID, taskID });
    if (!userTask) {
      return err(new TaskNotFound());
    }
    const task = await this.em.findOne(TaskDefinition, { id: taskID });
    if (!task) {
      return err(new TaskNotFound());
    }
    const canClaim = task.canClaim(userTask).isOk();
    return ok({
      ...task,
      canClaim,
      status: userTask.status,
    });
  }
}