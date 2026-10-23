import type { TaskID } from '@app/gamification';
import { ApiProperty } from '@nestjs/swagger';

export class DeliverTaskResponse {
  @ApiProperty({ type: String, description: '任务ID' })
  id: TaskID;
  constructor(id: TaskID) {
    this.id = id;
  }
}
