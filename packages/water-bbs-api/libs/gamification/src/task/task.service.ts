import {
  DomainError,
  err,
  InfrastructureError,
  isErr,
  isNone,
  ok,
} from 'water-bbs-shared';
import { TaskRegistry, Event } from './task.registry';
import { Engine } from 'json-rules-engine';
import { Reward, TaskStatus, UserTask } from 'water-bbs-migration';
import { EntityRepository } from '@mikro-orm/core';
import { RewardRegistry } from '../reward';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { canClaim } from './domain';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRegistry: TaskRegistry,
    @InjectRepository(Reward)
    private readonly rewardRepository: EntityRepository<Reward>,
    @InjectRepository(UserTask)
    private readonly userTaskRepository: EntityRepository<UserTask>,
    @Inject('ENGINE')
    private readonly engine: Engine,
    private readonly rewardRegistry: RewardRegistry,
  ) {}

  async complete(taskId: string, userId: string) {
    const taskResult = await this.taskRegistry.findTask(taskId);
    if (isErr(taskResult) || isNone(taskResult.value)) {
      if (isErr(taskResult)) {
        return taskResult;
      }
      return err(new DomainError('TASK_NOT_FOUND', null, { taskId }));
    }
    const runResult = await this.engine
      .run({ accountId: userId })
      .then((result) => ok(result))
      .catch((reason) =>
        err(new InfrastructureError(`INTERNAL_ERROR`, reason)),
      );
    if (isErr(runResult)) {
      return runResult;
    }
    const event = runResult.value.events[0] as Event | undefined;
    if (!event) {
      return err(new DomainError(`CAN_NOT_FOUND_REWARD`));
    }
    const rewardIds = event.params.rewardIds;
    for (const rewardId of rewardIds) {
      const reward = await this.rewardRepository.findOne(
        { id: rewardId },
        { cache: true },
      );
      if (!reward) {
        return err(new DomainError(`CAN_NOT_FOUND_REWARD`, null, { rewardId }));
      }
      const param = event.params.rewardParams[reward.id] ?? {};
      await this.rewardRegistry.applyReward(reward, userId, param);
    }
    return ok({ taskId });
  }
  async claim(taskId: string, userId: string) {
    const taskResult = await this.taskRegistry.findTask(taskId);
    if (isErr(taskResult)) {
      return taskResult;
    }
    if (isNone(taskResult.value)) {
      return err(new DomainError('TASK_NOT_FOUND', null, { taskId }));
    }
    const task = taskResult.value.value;
    const completedHistory = await this.userTaskRepository.findOne(
      {
        userId,
        taskId: taskId,
        status: TaskStatus.Completed,
      },
      { orderBy: { completedAt: 'desc' } },
    );
    const claimHistory = await this.userTaskRepository.findOne(
      {
        userId,
        taskId: taskId,
        status: TaskStatus.Claim,
      },
      { orderBy: { completedAt: 'desc' } },
    );
    const tasks: UserTask[] = [];
    if (completedHistory) {
      tasks.push(completedHistory);
    }
    if (claimHistory) {
      tasks.push(claimHistory);
    }
    const canClaimResult = canClaim(task, tasks);
    if (isErr(canClaimResult)) {
      return canClaimResult;
    }
    if (!canClaimResult.value) {
      return err(new DomainError('CLAIMING_TOO_EARLY'));
    }
    const userTask = UserTask.create(userId, taskId, new Date());
    await this.userTaskRepository.upsert(userTask);
    return ok(userTask);
  }
}
