import type { TaskID } from '@app/gamification';
import { UserTaskStatus } from '@app/gamification/task/infra';
import { WhenNodeDto } from './condition.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TaskDetailRequest {
  @ApiProperty({ type: String })
  id: TaskID;
}

export class TaskDetailResponse {
  @ApiProperty({ type: String, description: '任务ID' })
  id: TaskID;
  @ApiProperty({ type: String, description: '任务名称' })
  name: string;
  @ApiProperty({ type: String, description: '任务描述' })
  desc?: string;
  @ApiProperty({ type: String, description: '任务图标' })
  icon?: string;
  @ApiProperty({ type: Boolean, description: '是否可领取' })
  canClaim: boolean;
  @ApiProperty({
    type: String,
    description: '任务状态',
    enum: UserTaskStatus,
    required: false,
  })
  status?: UserTaskStatus;
  @ApiProperty({ type: [WhenNodeDto], description: '任务条件' })
  condition: WhenNodeDto[];
  @ApiProperty({ type: [WhenNodeDto], description: '任务奖励条件' })
  claim?: WhenNodeDto[];
}
