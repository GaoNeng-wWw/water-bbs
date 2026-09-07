import { ApiProperty } from '@nestjs/swagger';

export class GetCommentByResourceIdResponse {
  @ApiProperty({ type: 'string', description: '评论区ID' })
  id: string;
}
