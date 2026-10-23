import { Module } from '@nestjs/common';
import { TaskProgressCacheService, TaskProgressService } from './application';
import { FieldModule } from './infra/field';
import {
  CancelTaskService,
  ClaimTaskService,
  CreateTaskService,
  DeliverTaskService,
  RemoveTaskService,
} from './application/command';
import {
  GetTaskDetailService,
  ListTaskService,
  GetTaskProgressService,
  ListUserTaskService,
} from './application/query';
import { TaskRunnerService } from './application/runner';
import { RewardModule } from './infra/reward/reward.module';

@Module({
  imports: [RewardModule, FieldModule, TaskModule],
  providers: [
    TaskRunnerService,
    TaskProgressCacheService,
    TaskProgressService,
    RemoveTaskService,
    CreateTaskService,
    ClaimTaskService,
    CancelTaskService,
    DeliverTaskService,
    GetTaskDetailService,
    ListTaskService,
    GetTaskProgressService,
    ListUserTaskService,
  ],
  exports: [
    TaskRunnerService,
    TaskProgressCacheService,
    TaskProgressService,
    RemoveTaskService,
    CreateTaskService,
    ClaimTaskService,
    CancelTaskService,
    DeliverTaskService,
    GetTaskDetailService,
    ListTaskService,
    GetTaskProgressService,
  ],
})
export class TaskModule {}
