import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RedisService } from '@nestjs-redisx/core';
import {
  Injectable,
  OnApplicationBootstrap,
  Logger,
  Inject,
} from '@nestjs/common';
import { Engine } from 'json-rules-engine';
import { Reward, Task, TaskReward } from 'water-bbs-migration';
import {
  DomainError,
  err,
  isErr,
  isNone,
  isSome,
  none,
  ok,
  PersistenceError,
  some,
} from 'water-bbs-shared';
import { RewardRegistry } from '../reward';
import { EntityManager } from '@mikro-orm/core';

export type Event = {
  type: `${string}.reward`;
  params: {
    rewardIds: string[];
    rewardParams: Record<string, any>;
  };
};

@Injectable()
export class TaskRegistry implements OnApplicationBootstrap {
  private readonly logger = new Logger(TaskRegistry.name);
  constructor(
    @Inject('ENGINE')
    private readonly engine: Engine,
    @InjectRepository(Task)
    private readonly taskRepo: EntityRepository<Task>,
    @InjectRepository(TaskReward)
    private readonly taskRewardRepo: EntityRepository<TaskReward>,
    @InjectRepository(Reward)
    private readonly rewardRepo: EntityRepository<Reward>,
    private readonly redis: RedisService,
    private readonly rewardRegistry: RewardRegistry,
    private readonly em: EntityManager,
  ) {}
  async onApplicationBootstrap() {
    const tasks = await this.taskRepo.findAll({ cache: true });
    for (const task of tasks) {
      await this.load(task);
    }
  }
  async findTask(taskId: string) {
    return this.taskRepo
      .findOne({ id: taskId })
      .then((task) => {
        if (!task) {
          return ok(none);
        }
        return ok(some(task));
      })
      .catch((reason) => err(new PersistenceError(reason)));
  }
  async removeTask(taskId: string) {
    const taskResult = await this.findTask(taskId);
    if (isErr(taskResult)) {
      return taskResult;
    }
    const task = taskResult.value;
    if (isNone(task)) {
      return err(new DomainError('TASK_NOT_FOUND'));
    }
    task.value.remove();
    const taskRewards = await this.taskRewardRepo.find({
      taskId: task.value.id,
    });
    taskRewards.forEach((reward) => reward.remove());
    return this.em
      .transactional(async (em) => {
        await this.taskRepo.upsert(task.value, { em });
        await this.taskRewardRepo.upsertMany(taskRewards, { em });
        return task.value.id;
      })
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
  async listTasks(page: number, size: number) {
    const total = Number.parseInt((await this.redis.get(`tasks:cnt`)) ?? '0');
    const tasks = await this.taskRepo.findAll({
      offset: (page - 1) * size,
      limit: size,
    });
    return ok({ tasks, total });
  }
  async register(task: Task, rewards: Reward[]) {
    const rewardSummary = rewards.map((r) => ({ id: r.id, code: r.code }));
    const taskResult = await this.findTask(task.id);
    if (isErr(taskResult)) {
      return taskResult;
    }
    if (isSome(taskResult.value)) {
      return err(new DomainError('TASK_EXISTING'));
    }
    for (const { code } of rewardSummary) {
      if (isNone(this.rewardRegistry.getRewardHandler(code))) {
        return err(new DomainError('REWARD_NOT_FOUND', null, { code }));
      }
    }
    return this.em
      .transactional(async (em) => {
        em.persist(task);
        for (const { id } of rewards) {
          em.persist(TaskReward.create({ rewardId: id, taskId: task.id }));
        }
        await em.flush();
        await this.redis.incr(`tasks:cnt`);
      })
      .then(() => ok(task.id))
      .catch((reason) => err(new PersistenceError(reason)));
  }
  private async load(task: Task) {
    const rewardIds = await this.taskRewardRepo.find(
      {
        taskId: task.id,
      },
      { fields: ['rewardId'], cache: true },
    );
    for (const { rewardId } of rewardIds) {
      const reward = await this.rewardRepo.findOne(
        {
          id: rewardId,
        },
        { cache: true },
      );
      if (!reward) {
        this.logger.warn(`Can not found reward ${rewardId}`);
        return;
      }
    }
    this.engine.addRule({
      conditions: task.condition as any,
      event: {
        type: `${task.code}.reward`,
        params: {
          rewardIds,
          rewardParams: task.param,
        },
      },
    });
    this.logger.log(`Load ${task.label} successed!`);
  }
}
