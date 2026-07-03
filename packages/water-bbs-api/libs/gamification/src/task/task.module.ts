import { Module } from '@nestjs/common';
import { RewardModule } from '../reward';
import { TaskRegistry } from './task.registry';
import { TaskService } from './task.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Reward, Task, TaskReward, UserTask } from 'water-bbs-migration';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [
    DiscoveryModule,
    RewardModule,
    MikroOrmModule.forFeature([Task, TaskReward, Reward, UserTask]),
  ],
  providers: [TaskRegistry, TaskService],
  exports: [TaskRegistry, TaskService],
})
export class TaskModule {}
