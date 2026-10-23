import { TaskSummary } from '@app/gamification/task/application/query';
import { CursorDTO } from '@app/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

enum UserTaskStatus {
  Progress = 'Progress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export class GetTaskListRequest extends CursorDTO {
  @IsEnum(['progress', 'completed'])
  @IsOptional()
  @ApiProperty({ enum: ['progress', 'completed'], required: false })
  status?: 'progress' | 'completed';
}

export class GetTaskListResponseItem implements TaskSummary {
  @ApiProperty({ description: '任务ID' })
  id: string;
  @ApiProperty({ description: '任务名称' })
  name: string;
  @ApiProperty({ description: '任务图标', required: false, type: String })
  icon?: string | undefined;
  @ApiProperty({ description: '任务描述', required: false, type: String })
  desc?: string | undefined;
  @ApiProperty({
    description: '任务状态',
    required: false,
    enum: UserTaskStatus,
    enumName: 'UserTaskStatus',
  })
  status?: UserTaskStatus | undefined;
  @ApiProperty({ description: '是否可领取', required: false, type: Boolean })
  canClaim?: boolean | undefined;
}
