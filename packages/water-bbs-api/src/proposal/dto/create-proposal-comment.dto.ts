import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProposalCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreateProposalCommandResponse {
  @Expose()
  @ApiProperty()
  commentId: string;
}
