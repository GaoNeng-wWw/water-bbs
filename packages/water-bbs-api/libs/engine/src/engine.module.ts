import { Module } from '@nestjs/common';
import { EngineKey } from './core';
import { Engine } from 'json-rules-engine';
import { StepDiscoverService } from './step';
import { ResolverDiscoverService } from './resolver';
import {
  CreateTriggerService,
  RemoveTriggerService,
  TriggerDiscover,
  TriggerEntity,
} from './trigger';
import { ScheduleModule } from '@nestjs/schedule';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WorkflowEntity } from './workflow';
import { DiscoveryModule } from '@nestjs/core';
import { OnTriggerFire } from './workflow';
import { RemoveWorkflowService } from './workflow/commands';

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
    CreateTriggerService,
    RemoveTriggerService,
    RemoveWorkflowService,
    OnTriggerFire,
  ],
})
export class EngineModule {}
