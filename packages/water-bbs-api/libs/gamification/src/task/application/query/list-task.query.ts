import { ok, Result } from 'neverthrow';
import { ApplicationError, CursorDTO, CursorPagination } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { TaskDefinition, UserTask, UserTaskStatus } from '../../infra';
import { AccountId } from 'src/auth';

export type TaskSummary = {
  id: string;
  name: string;
  icon?: string;
  desc?: string;
  status?: UserTaskStatus;
  canClaim?: boolean;
};

export class ListTask extends Query<
  Result<CursorPagination<TaskSummary>, ApplicationError>
> {
  constructor(
    public readonly dto: CursorDTO,
    public readonly userID?: string,
  ) {
    super();
  }
}

@QueryHandler(ListTask)
export class ListTaskService implements IQueryHandler<ListTask> {
  constructor(private readonly em: EntityManager) {}
  async execute(
    query: ListTask,
  ): Promise<Result<CursorPagination<TaskSummary>, ApplicationError>> {
    const tasks = await this.em.findByCursor(TaskDefinition, {
      last: query.dto.size,
      after: query.dto.cursor,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const summary: TaskSummary[] = [];
    for (const task of tasks) {
      const userTaskRecord = await this.em.findOne(UserTask, {
        accountID: query.userID as AccountId,
        taskID: task.id,
      });
      const status = userTaskRecord?.status;
      const canClaim = userTaskRecord
        ? task.canClaim(userTaskRecord).isOk()
        : true;
      summary.push({
        id: task.id,
        canClaim,
        desc: task.desc,
        icon: task.icon,
        name: task.name,
        status,
      });
    }
    return ok(
      new CursorPagination({
        items: summary,
        nextCursor: tasks.endCursor,
        prevCursor: tasks.startCursor,
        total: tasks.totalCount,
      }),
    );
  }
}