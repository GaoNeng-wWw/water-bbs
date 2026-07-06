import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindTaskQuery, ListTaskQuery } from './queries';
import {
  ClaimTaskCommand,
  CreateTaskCommand,
  DeliveryTaskCommand,
  RemoveTaskCommand,
} from './commands';
import { CreateTaskRequest } from './dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly qb: QueryBus,
    private readonly cb: CommandBus,
  ) {}
  createTask(dto: CreateTaskRequest) {
    return this.cb.execute(new CreateTaskCommand(dto));
  }
  removeTask(taskId: string) {
    return this.cb.execute(new RemoveTaskCommand(taskId));
  }
  claimTask(accountId: string, taskId: string) {
    return this.cb.execute(new ClaimTaskCommand(accountId, taskId));
  }
  deliveryTask(accountId: string, taskId: string) {
    return this.cb.execute(new DeliveryTaskCommand(accountId, taskId));
  }
  async listTask(page: number, size: number) {
    return this.qb.execute(new ListTaskQuery(page, size));
  }
  async findTask(id: string, userId?: string) {
    return this.qb.execute(new FindTaskQuery(id, userId));
  }
}
