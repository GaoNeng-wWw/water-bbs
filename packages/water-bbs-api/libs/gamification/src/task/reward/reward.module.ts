import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Point } from './point-incr.reward';
import { RewardDiscoverService } from './reward.discover.service';

@Module({
  imports: [DiscoveryModule],
  providers: [Point, RewardDiscoverService],
  exports: [Point],
})
export class RewardModule {}
