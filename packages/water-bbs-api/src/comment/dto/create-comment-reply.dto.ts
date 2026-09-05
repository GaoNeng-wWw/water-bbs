import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentReplyRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: '回复内容' })
  content: string;
}
