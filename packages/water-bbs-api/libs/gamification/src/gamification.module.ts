import { Module } from '@nestjs/common';
import { RewardModule, RewardRegistry } from './reward';
import { TaskModule, TaskRegistry, TaskService } from './task';
import { EngineModule } from './engine.module';
import { DiscoveryModule } from '@nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Reward, Task, TaskReward, UserTask } from 'water-bbs-migration';
import { FactFactory } from './fact/fact.factory';

@Module({
  imports: [
    DiscoveryModule,
    MikroOrmModule.forFeature([Task, TaskReward, Reward, UserTask]),
    EngineModule,
    RewardModule,
    TaskModule,
  ],
  providers: [RewardRegistry, TaskRegistry, TaskService, FactFactory],
  exports: [RewardRegistry, TaskRegistry, TaskService],
})
export class GamificationModule {}
