import { ProposalKind, ProposalStatus } from '@app/gamification';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export type ListProposalItemProps = {
  id: string;
  title: string;
  status: ProposalStatus;
  createdAt: Date;
  updatedAt: Date;
  yes: number;
  no: number;
  total: number;
}

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
  @ApiProperty({ description: '同意数' })
  yes: number;
  @ApiProperty({ description: '反对数' })
  no: number;
  @ApiProperty({ description: '总票数' })
  total: number;
  @ApiProperty({ description: '过期时间' })
  @Transform(({ value }) => (value as Date).toISOString())
  endAt: string;
  @ApiProperty({ description: '提案类型', enum: ProposalKind })
  kind: ProposalKind;

  constructor(props: ListProposalItemProps) {
    Object.assign(this, props);
  }
}

export type ListProposalResponseProps = {
  items: ListProposalItem[];
  nextCursor: string | null;
  prevCursor: string | null;
  total: number;
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

  constructor(props: ListProposalResponseProps) {
    Object.assign(this, props);
  }
}
