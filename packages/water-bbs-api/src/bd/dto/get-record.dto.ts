import { ApiProperty } from '@nestjs/swagger';

export class GovernanceMemberInfo {
  @ApiProperty({ description: '治理成员类型', enum: ['admin', 'bd'] })
  kind: 'admin' | 'bd';
  @ApiProperty({ description: '开始时间' })
  startedAt: Date;
  @ApiProperty({ description: '结束时间' })
  endedAt?: Date;
}
