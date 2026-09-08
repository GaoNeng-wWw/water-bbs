import { ProposalStatus } from '@app/gamification';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ListProposalItem {
  @ApiProperty({ description: '提案ID' })
  id: string;
  @ApiProperty({ description: '提案标题' })
  title: string;
  @ApiProperty({ description: '提案状态' })
  status: ProposalStatus;
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
  @ApiProperty({ description: '更新时间' })
  @Transform(({ value }) => (value as Date).toISOString())
  updatedAt: string;
}
export class ListProposalResponse {
  @ApiProperty({ description: '提案列表', type: [ListProposalItem] })
  items: ListProposalItem[];
  @ApiProperty({ description: '下一页游标', type: String, nullable: true })
  nextCursor: string | null;
  @ApiProperty({ description: '上一页游标', type: String, nullable: true })
  prevCursor: string | null;
  @ApiProperty({ description: '总提案数', type: Number })
  total: number;
}
