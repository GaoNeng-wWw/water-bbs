import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { RewardService } from './reward.service';
import { RewardPoint } from './provider';

@Module({
  imports: [DiscoveryModule],
  providers: [RewardPoint, RewardService],
  exports: [RewardPoint, RewardService],
})
export class RewardModule {}
