import { ApiProperty } from '@nestjs/swagger';

export class TaskProgressItem {
  @ApiProperty({ type: String, description: '任务进度字段' })
  field: string;
  @ApiProperty({ type: Object, description: '任务进度值' })
  value: any;
}

export class TaskProgressResponse {
  @ApiProperty({ type: [TaskProgressItem], description: '任务进度列表' })
  items: TaskProgressItem[];

  constructor(items: TaskProgressItem[]) {
    this.items = items;
  }
}
