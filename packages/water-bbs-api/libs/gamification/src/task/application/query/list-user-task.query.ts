import { ApplicationError, CursorDTO, CursorPagination } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';
import { TaskSummary } from './list-task.query';
import { EntityManager } from '@mikro-orm/sqlite';
import { UserTask, UserTaskStatus } from '../../infra';
import { AccountId } from 'src/auth';
import { Task } from '../../schema';

export class ListUserTask extends Query<
  Result<CursorPagination<TaskSummary>, ApplicationError>
> {
  constructor(
    public readonly dto: CursorDTO,
    public readonly userID: string,
    public readonly status?: 'progress' | 'completed',
  ) {
    super();
  }
}
@QueryHandler(ListUserTask)
export class ListUserTaskService implements IQueryHandler<ListUserTask> {
  constructor(private readonly em: EntityManager) {}
  async execute(
    query: ListUserTask,
  ): Promise<Result<CursorPagination<TaskSummary>, ApplicationError>> {
    const summary: TaskSummary[] = [];
    const targetStatus =
      query.status === 'progress'
        ? UserTaskStatus.Progress
        : UserTaskStatus.Completed;
    const where = {
      accountID: query.userID as AccountId,
      status: targetStatus,
    };
    const seen = new Set<string>();
    let cursor: string | null | undefined = query.dto.cursor;
    while (summary.length < query.dto.size) {
      const userTasks = await this.em.findByCursor(UserTask, {
        where,
        last: query.dto.size,
        after: cursor ?? undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      for (const ut of userTasks) {
        if (seen.has(ut.taskID)) {
          continue;
        }
        seen.add(ut.taskID);
        const { name, desc } = ut.snapshot as Task;
        summary.push({
          id: ut.taskID,
          canClaim: false,
          name,
          desc,
          icon: '',
          status: ut.status,
        });
        if (summary.length >= query.dto.size) break;
      }
      cursor = userTasks.endCursor;
      if (!cursor || userTasks.items.length === 0) break;
    }
    const [row] = await this.em
      .getConnection()
      .execute<{ count: number }[]>(
        'select count(distinct `task_id`) as `count` from `user_task` where `account_id` = ? and `status` = ?',
        [query.userID, targetStatus],
      );
    const total = Number(row?.count ?? 0);
    return ok(
      new CursorPagination({
        items: summary,
        nextCursor: cursor,
        prevCursor: null,
        total: Number(total),
      }),
    );
  }
}
