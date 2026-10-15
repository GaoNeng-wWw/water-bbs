import { Module } from '@nestjs/common';
import { TaskProgressCacheService, TaskProgressService } from './application';
import { FieldModule } from './infra/field';

@Module({
  imports: [FieldModule, TaskModule],
  providers: [TaskProgressCacheService, TaskProgressService],
  exports: [TaskProgressCacheService, TaskProgressService],
})
export class TaskModule {}
