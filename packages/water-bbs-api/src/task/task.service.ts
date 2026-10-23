import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ClaimTaskResponse,
  CreateTaskDto,
  CreateTaskResponse,
  RemoveTaskRequest,
  RemoveTaskResponse,
} from './dto';
import {
  CancelTask,
  ClaimTask,
  CreateTask,
  DeliverTask,
  RemoveTask,
} from '@app/gamification/task/application/command';
import { CursorDTO } from '@app/shared';
import {
  GetTaskDetail,
  GetTaskProgress,
  ListTask,
} from '@app/gamification/task/application/query';
import { AccountId } from 'src/auth';
import { TaskID } from '@app/gamification';
import { CancelTaskResponse } from './dto/cancel-task.dto';
import { DeliverTaskResponse } from './dto/deliver-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly query: QueryBus,
    private readonly cmd: CommandBus,
  ) {}

  async createTask(dto: CreateTaskDto) {
    const taskIDResult = await this.cmd.execute(new CreateTask(dto.schema));
    return taskIDResult.map((item) => new CreateTaskResponse(item));
  }

  async removeTask(dto: RemoveTaskRequest) {
    const result = await this.cmd.execute(new RemoveTask(dto.id));
    return result.map((id) => new RemoveTaskResponse(id));
  }

  listTask(dto: CursorDTO, accountID?: AccountId) {
    return this.query.execute(new ListTask(dto, accountID));
  }
  getTaskDetail(id: TaskID, accountID: AccountId) {
    return this.query.execute(new GetTaskDetail(id, accountID));
  }
  getTaskProgress(id: TaskID, accountID: AccountId) {
    return this.query.execute(new GetTaskProgress(accountID, id));
  }

  claimTask(id: TaskID, accountID: AccountId) {
    return this.cmd
      .execute(new ClaimTask(accountID, id))
      .then((result) => result.map((id) => new ClaimTaskResponse(id)));
  }
  cancelTask(id: TaskID, accountID: AccountId) {
    return this.cmd
      .execute(new CancelTask(accountID, id))
      .then((result) => result.map((id) => new CancelTaskResponse(id)));
  }
  deliverTask(id: TaskID, accountID: AccountId) {
    return this.cmd
      .execute(new DeliverTask(accountID, id))
      .then((result) => result.map((id) => new DeliverTaskResponse(id)));
  }
}
