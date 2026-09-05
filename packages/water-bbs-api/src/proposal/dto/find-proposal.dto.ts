import { ProposalStatus } from '@app/gamification';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

class ProposalStep {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '提案步骤名称' })
  @Expose()
  stepName: string;
  @IsObject()
  @ApiProperty({ description: '提案步骤参数' })
  @Expose()
  param: Record<string, any>;
}

class ProposalVoteSummary {
  @ApiProperty({ description: '支持票' })
  @Expose()
  yes: number;
  @ApiProperty({ description: '反对票' })
  @Expose()
  no: number;
}

export class FindProposalResponseDTO {
  @Expose()
  @ApiProperty({ description: '提案ID' })
  id: string;
  @Expose()
  @ApiProperty({ description: '提案内容' })
  content: string;
  @Expose()
  @ApiProperty({ description: '提案标题' })
  title: string;

  @Expose()
  @ApiProperty({ description: '提案步骤', type: [ProposalStep] })
  @Type(() => ProposalStep)
  step: ProposalStep[];

  @Expose()
  @ApiProperty({ description: '提案创建时间' })
  createdAt: string;

  @Expose()
  @ApiProperty({ description: '提案状态', enum: ProposalStatus })
  status: ProposalStatus;

  @Expose()
  @ApiProperty({ description: '提案投票摘要', type: ProposalVoteSummary })
  @Type(() => ProposalVoteSummary)
  voteSummary: ProposalVoteSummary;
}
