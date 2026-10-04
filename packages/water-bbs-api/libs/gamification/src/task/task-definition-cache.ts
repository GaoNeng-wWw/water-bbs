import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TaskID, UserTask, UserTaskStatus } from './entites';
import { IReward } from './schema';

@Injectable()
export class UserTaskCache implements OnApplicationBootstrap {
  private taskIDRewardMap: Map<TaskID, IReward[]> = new Map();
  private triggerTaskIDMap: Map<string, TaskID> = new Map();
  constructor(private readonly em: EntityManager) {}
  async onApplicationBootstrap() {
    const userTasks = this.em.stream(UserTask, {
      where: {
        status: UserTaskStatus.Progress,
      },
    });
    for await (const { taskID, snapshot } of userTasks) {
      this.addCache(taskID, snapshot);
      snapshot.trigger.events.forEach((event) =>
        this.triggerTaskIDMap.set(event, taskID),
      );
    }
  }
  addCache(taskID: TaskID, reward: IReward){
    const defs = this.taskIDRewardMap.get(taskID) ?? [];
    defs.push(reward);
    this.taskIDRewardMap.set(taskID, defs);
  }
  clearCache(taskID: TaskID) {
    const rewards = this.taskIDRewardMap.get(taskID);
    if (!rewards) {
      return;
    }
    rewards.forEach((reward) => {
      reward.trigger.events.forEach((eventName) => {
        this.triggerTaskIDMap.delete(eventName);
      });
    });
    this.taskIDRewardMap.delete(taskID);
  }
}
