import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DomainError, isErr, ok, Result } from 'water-bbs-shared';
import { ListTaskItem, ListTaskResponse } from '../dto';
import { TaskRegistry } from '@app/gamification';

export class ListTaskQuery extends Query<
  Result<ListTaskResponse, DomainError>
> {
  constructor(
    public readonly page: number,
    public readonly size: number,
  ) {
    super();
  }
}

@QueryHandler(ListTaskQuery)
export class ListTask implements IQueryHandler<ListTaskQuery> {
  constructor(private readonly taskRegistry: TaskRegistry) {}
  async execute({
    page,
    size,
  }: ListTaskQuery): Promise<Result<ListTaskResponse, DomainError>> {
    const tasksResult = await this.taskRegistry.listTasks(page, size);
    if (isErr(tasksResult)) {
      return tasksResult;
    }
    const { tasks, total } = tasksResult.value;
    const taskItems: ListTaskItem[] = tasks.map((task) => {
      return {
        id: task.id,
        label: task.label,
        description: task.description,
        createdAt: task.createdAt,
      };
    });
    return ok({
      items: taskItems,
      total,
    });
  }
}
