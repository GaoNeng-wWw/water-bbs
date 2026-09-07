import { ApiProperty } from '@nestjs/swagger';

export class GetReplyResponse {
  @ApiProperty({ description: '是否有子回复' })
  hasChildren: boolean;
  @ApiProperty({ description: '回复ID' })
  replyId: string;
  @ApiProperty({ description: '回复内容' })
  content: string;
  @ApiProperty({ description: '创建人ID' })
  creator: string;
}
