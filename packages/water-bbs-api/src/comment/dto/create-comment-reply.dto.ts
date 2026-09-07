import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentReplyRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: '回复内容' })
  content: string;
}

export class CreateCommentReplyResponse {
  @ApiProperty({ description: '是否包含子回复' })
  hasChildren: boolean;
  @ApiProperty({ description: '回复ID' })
  replyId: string;
  @ApiProperty({ description: '创建人ID' })
  creator: string;
  @ApiProperty({ description: '回复内容' })
  content: string;
}
