import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ClaimTask } from './commands/claim-task';
import { DeliveryTask } from './commands/delivery-task';
import { RemoveTask } from './commands/remove-task';
import { FindTask, ListTask, GetRewards, GetFact } from './queries';
import { CreateTask } from './commands';
import { GamificationModule } from '@app/gamification';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Reward, Task, TaskReward, UserTask } from 'water-bbs-migration';

@Module({
  imports: [
    GamificationModule,
    MikroOrmModule.forFeature([Task, TaskReward, Reward, UserTask]),
  ],
  controllers: [TaskController],
  providers: [
    TaskService,
    ClaimTask,
    DeliveryTask,
    RemoveTask,
    FindTask,
    ListTask,
    CreateTask,
    GetRewards,
    GetFact,
  ],
})
export class TaskModule {}
