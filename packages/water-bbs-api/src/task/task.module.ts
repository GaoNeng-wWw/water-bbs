import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ClaimTask } from './commands/claim-task';
import { DeliveryTask } from './commands/delivery-task';
import { RemoveTask } from './commands/remove-task';
import { FindTask, ListTask } from './queries';
import { CreateTask } from './commands';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    ClaimTask,
    DeliveryTask,
    RemoveTask,
    FindTask,
    ListTask,
    CreateTask
  ],
})
export class TaskModule {}
