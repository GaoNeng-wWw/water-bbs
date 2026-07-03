import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { TaskService } from '../task.service';

export class TaskCompletedEvent implements IEvent {
  constructor(
    public readonly taskId: string,
    public readonly userId: string,
  ) {}
}

@EventsHandler(TaskCompletedEvent)
export class TaskCompletedEventHandler implements IEventHandler<TaskCompletedEvent> {
  constructor(private taskService: TaskService,) {}
  async handle(event: TaskCompletedEvent) {
    await this.taskService.complete(event.taskId, event.userId);
  }
}
