import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { CelModule } from './cel/cel.module';
import { RewardModule } from './reward';

@Module({
  imports: [DiscoveryModule, CelModule, RewardModule],
})
export class TaskModule {}
