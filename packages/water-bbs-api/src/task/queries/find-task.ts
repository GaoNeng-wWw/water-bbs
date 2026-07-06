import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DomainError, err, isErr, isNone, ok, Result } from 'water-bbs-shared';
import { FindTaskInfo } from '../dto';
import { TaskRegistry } from '@app/gamification';
import { PeriodUnit, UserTask } from 'water-bbs-migration';
import { EntityRepository } from '@mikro-orm/mysql';
import { nextClaimableAt } from '@app/gamification';

export class FindTaskQuery extends Query<Result<FindTaskInfo, DomainError>> {
  constructor(
    public readonly taskId: string,
    public readonly accountId?: string,
  ) {
    super();
  }
}

@QueryHandler(FindTaskQuery)
export class FindTask implements IQueryHandler<FindTaskQuery> {
  constructor(
    private readonly taskRegistry: TaskRegistry,
    private readonly userTaskRepository: EntityRepository<UserTask>,
  ) {}
  async execute({
    taskId,
    accountId,
  }: FindTaskQuery): Promise<Result<FindTaskInfo, DomainError>> {
    const taskResult = await this.taskRegistry.findTask(taskId);
    if (isErr(taskResult)) {
      return taskResult;
    }
    const taskOption = taskResult.value;
    if (isNone(taskOption)) {
      return err(new DomainError('TASK_NOT_FOUND'));
    }
    const task = taskOption.value;
    if (!accountId) {
      return ok(
        new FindTaskInfo({
          id: task.id,
          label: task.label,
          description: task.description,
          createdAt: task.createdAt,
          once: task.period.unit === PeriodUnit.Once,
          canClaim: false,
        }),
      );
    }
    const userTaskRecord = await this.userTaskRepository.find(
      {
        taskId: task.id,
        userId: accountId,
      },
      { limit: 10, orderBy: { createdAt: 'desc' } },
    );
    const claimableAt = nextClaimableAt(task, userTaskRecord);
    if (isErr(claimableAt)) {
      return claimableAt;
    }
    return ok(
      new FindTaskInfo({
        id: task.id,
        label: task.label,
        description: task.description,
        createdAt: task.createdAt,
        canClaim: true,
        claimableAt: claimableAt.value,
        once: task.isOnce(),
      }),
    );
  }
}
