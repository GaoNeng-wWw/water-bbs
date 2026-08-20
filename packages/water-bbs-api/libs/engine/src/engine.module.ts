import { Module } from '@nestjs/common';
import { EngineKey } from './core';
import { Engine } from 'json-rules-engine';
import { StepDiscoverService } from './step';
import { ResolverDiscoverService } from './resolver';
import { TriggerDiscover, TriggerEntity } from './trigger';
import { ScheduleModule } from '@nestjs/schedule';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WorkflowEntity } from './workflow';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [
    DiscoveryModule,
    ScheduleModule.forRoot(),
    MikroOrmModule.forFeature([WorkflowEntity, TriggerEntity]),
  ],
  providers: [
    TriggerDiscover,
    ResolverDiscoverService,
    StepDiscoverService,
    {
      provide: EngineKey,
      useValue: new Engine([]),
    },
  ],
})
export class EngineModule {}
