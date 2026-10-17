import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskModule as GamificationTaskModule } from '@app/gamification/task';

@Module({
  imports: [GamificationTaskModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
