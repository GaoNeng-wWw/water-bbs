import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { TaskProgress } from '../dto/task-progress.dto';
import { AccountId } from 'src/auth';
import { TaskID } from '../../infra';
import { TaskProgressService } from '../task-progress.service';
import { ApplicationError, InternalError } from '@app/shared';
import { Result } from 'neverthrow';

export class GetTaskProgress extends Query<
  Result<TaskProgress, ApplicationError>
> {
  constructor(
    public accountID: AccountId,
    public taskID: TaskID,
  ) {
    super();
  }
}

@QueryHandler(GetTaskProgress)
export class GetTaskProgressService implements IQueryHandler<GetTaskProgress> {
  constructor(private taskProgressService: TaskProgressService) {}
  async execute({
    accountID,
    taskID,
  }: GetTaskProgress): Promise<Result<TaskProgress, ApplicationError>> {
    const progress = await this.taskProgressService.countProgress(
      accountID,
      taskID,
    );
    return progress.mapErr((err) =>
      new InternalError(err).toApplicationError(),
    );
  }
}
