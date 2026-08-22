import { Module } from '@nestjs/common';
import { EngineKey } from './core';
import { Engine } from 'json-rules-engine';
import { StepDiscoverService } from './step';
import { ResolverDiscoverService } from './resolver';
import { ScheduleModule } from '@nestjs/schedule';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TriggerEntity, WorkflowEntity } from './workflow';
import { DiscoveryModule } from '@nestjs/core';
import { WorkflowRegistryService } from './workflow/workflow-registry.service';
import { WorkflowService } from './workflow/workflow.service';

@Module({
  imports: [
    DiscoveryModule,
    ScheduleModule.forRoot(),
    MikroOrmModule.forFeature([WorkflowEntity, TriggerEntity]),
  ],
  providers: [
    ResolverDiscoverService,
    StepDiscoverService,
    {
      provide: EngineKey,
      useValue: new Engine([]),
    },
    WorkflowRegistryService,
    WorkflowService,
  ],
})
export class EngineModule {}
