import { Module } from '@nestjs/common';
import { RewardRegistry } from './reward-registry.service';
import { DiscoveryModule } from '@nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Reward, Task, TaskReward, UserTask } from 'water-bbs-migration';

@Module({
  imports: [
    DiscoveryModule,
    MikroOrmModule.forFeature([Task, Reward, TaskReward, UserTask])
  ],
  providers: [RewardRegistry],
  exports: [RewardRegistry],
})
export class RewardModule {}
