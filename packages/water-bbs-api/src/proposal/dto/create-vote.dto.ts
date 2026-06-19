import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VoteAction } from 'water-bbs-migration';

export class CreateVote {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;
  @IsNotEmpty()
  @IsEnum(VoteAction)
  @ApiProperty({ enum: () => VoteAction })
  action: VoteAction;
}
