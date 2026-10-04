import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { CelModule } from './cel/cel.module';

@Module({
  imports: [DiscoveryModule, CelModule],
})
export class TaskModule {}
