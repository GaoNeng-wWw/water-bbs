import type { ProposalId } from '@app/gamification';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum VoteKind {
  Agree = 'Agree',
  DisAgree = 'DisAgree',
}

export class VoteProposalDTO {
  @IsString()
  @ApiProperty({ description: '提案ID' })
  @IsNotEmpty()
  id: ProposalId;
  @IsEnum(VoteKind)
  @IsNotEmpty()
  @ApiProperty({ description: '投票类型', enum: VoteKind })
  kind: VoteKind;
}

export class VoteProposalResponseDTO {
  @ApiProperty({ description: '投票ID' })
  id: string;
}
