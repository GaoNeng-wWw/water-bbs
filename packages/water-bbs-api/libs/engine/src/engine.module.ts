import { Module } from '@nestjs/common';
import { EngineKey } from './core';
import { Engine } from 'json-rules-engine';
import { StepDiscoverService, StepRunner } from './step';
import { ScheduleModule } from '@nestjs/schedule';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule, ScheduleModule.forRoot()],
  providers: [
    StepDiscoverService,
    {
      provide: EngineKey,
      useValue: new Engine([]),
    },
    StepRunner
  ],
  exports: [StepDiscoverService,StepRunner],
})
export class EngineModule {}
