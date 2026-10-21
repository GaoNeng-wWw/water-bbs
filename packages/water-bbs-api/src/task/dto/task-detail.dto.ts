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
  @ApiProperty({
    oneOf: [
      { $ref: '#/components/schemas/WhenAllDto' },
      { $ref: '#/components/schemas/WhenAnyDto' },
      { $ref: '#/components/schemas/WhenNotDto' },
      { $ref: '#/components/schemas/WhenExpressionDto' },
    ],
    description: '条件节点：all/any/not 逻辑组合或叶子表达式',
  })
  condition: Record<string, any>;
  @ApiProperty({
    oneOf: [
      { $ref: '#/components/schemas/WhenAllDto' },
      { $ref: '#/components/schemas/WhenAnyDto' },
      { $ref: '#/components/schemas/WhenNotDto' },
      { $ref: '#/components/schemas/WhenExpressionDto' },
    ],
    description: '条件节点：all/any/not 逻辑组合或叶子表达式',
  })
  claim?: Record<string, any>;
  @ApiProperty({ type: [Object], description: '任务奖励' })
  reward: Record<string, string>[];
  @ApiProperty({ type: 'boolean' })
  claimed?: boolean;
  constructor(props: TaskDetailResponse){
    Object.assign(this, props);
  }
}
