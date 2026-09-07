import { ApiProperty } from '@nestjs/swagger';

export class RemoveCommentResponse {
  @ApiProperty({ description: '评论ID' })
  id: string;
}
