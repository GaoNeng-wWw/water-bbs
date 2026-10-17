import type { Task, TaskID } from '@app/gamification';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ type: Object, description: '任务定义' })
  schema: Task;
}

export class CreateTaskResponse {
  @ApiProperty({ type: String, description: '任务ID' })
  id: TaskID;
  constructor(id: TaskID) {
    this.id = id;
  }
}

