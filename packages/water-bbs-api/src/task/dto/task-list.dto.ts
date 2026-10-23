import { TaskSummary } from '@app/gamification/task/application/query';
import { UserTaskStatus } from '@app/gamification/task/infra';
import { ApiProperty } from '@nestjs/swagger';

export class GetTaskListResponseItem implements TaskSummary {
  @ApiProperty({ description: '任务名称' })
  name: string;
  @ApiProperty({ description: '任务图标', required: false })
  icon?: string | undefined;
  @ApiProperty({ description: '任务描述', required: false })
  desc?: string | undefined;
  @ApiProperty({
    description: '任务状态',
    required: false,
    enum: UserTaskStatus,
  })
  status?: UserTaskStatus | undefined;
  @ApiProperty({ description: '是否可领取', required: false })
  canClaim?: boolean | undefined;
}
