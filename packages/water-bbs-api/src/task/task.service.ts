import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ClaimTaskResponse,
  CreateTaskDto,
  CreateTaskResponse,
  GetTaskListRequest,
  RemoveTaskRequest,
  RemoveTaskResponse,
  TaskDetailResponse,
  TaskProgressResponse,
} from './dto';
import {
  CancelTask,
  ClaimTask,
  CreateTask,
  DeliverTask,
  RemoveTask,
} from '@app/gamification/task/application/command';
import {
  GetTaskDetail,
  GetTaskProgress,
  ListTask,
  ListUserTask,
} from '@app/gamification/task/application/query';
import { AccountId } from 'src/auth';
import { TaskID } from '@app/gamification';
import { CancelTaskResponse } from './dto/cancel-task.dto';
import { DeliverTaskResponse } from './dto/deliver-task.dto';
import z from 'zod';
import schema from '@app/gamification/task/schema/core';

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

  listTask(dto: GetTaskListRequest, accountID?: AccountId) {
    const status = dto.status;
    if (!status) {
      return this.query.execute(new ListTask(dto, accountID));
    }
    if (!accountID) {
      return this.query.execute(new ListTask(dto, accountID));
    }
    return this.query.execute(new ListUserTask(dto, accountID, status));
  }
  getTaskDetail(id: TaskID, accountID: AccountId) {
    return this.query.execute(new GetTaskDetail(id, accountID)).then((res) => {
      return res.map(
        (t) =>
          new TaskDetailResponse({
            ...t,
            reward: t.reward
              .map((reward) => reward.desc)
              .filter((value) => !!value)
              .map((reward) => reward),
          }),
      );
    });
  }
  getTaskProgress(id: TaskID, accountID: AccountId) {
    return this.query
      .execute(new GetTaskProgress(accountID, id))
      .then((resp) => {
        return resp.map((p) => new TaskProgressResponse(p));
      });
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

  getSchema() {
    return z.toJSONSchema(schema);
  }
}
