import { ProposalStatus } from '@app/gamification';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProposalStep {
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

export enum ProposalKind {
  Normal = 'normal',
  Emergency = 'emergency',
}
export class CreateProposalDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '提案标题' })
  title: string;
  @IsEnum(ProposalKind)
  @IsNotEmpty()
  @ApiProperty({ description: '提案类型', enum: ProposalKind })
  kind: ProposalKind;

  @ApiProperty({ description: '提案步骤', type: [ProposalStep] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProposalStep)
  steps: ProposalStep[];
  @ApiProperty({ description: '提案结束时间' })
  @IsDate()
  proposalEndAt?: Date;

  @ApiProperty({ description: '提案内容' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateProposalResponseDTO {
  @ApiProperty({ description: '提案ID' })
  @Expose()
  @ApiProperty()
  id: string;

  @ApiProperty({ description: '提案标题' })
  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty({ description: '提案步骤', type: [ProposalStep] })
  @Type(() => ProposalStep)
  step: ProposalStep[];

  @ApiProperty({ description: '提案创建时间' })
  @Expose()
  createdAt: string;

  @Expose()
  @ApiProperty({ description: '提案状态', enum: ProposalStatus })
  status: ProposalStatus;
}
