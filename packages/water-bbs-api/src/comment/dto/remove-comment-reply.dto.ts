import { ApiProperty } from '@nestjs/swagger';

export class RemoveCommentReplyResponse {
  @ApiProperty({ description: '删除的评论回复ID' })
  id: string;
}
