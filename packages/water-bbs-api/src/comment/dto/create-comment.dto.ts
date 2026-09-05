import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ResourceKind } from '../comment.entity';

export class CreateCommentRequest {
  @IsString()
  @ApiProperty({ type: String, description: '评论内容' })
  content: string;
  @IsEnum(ResourceKind)
  @ApiProperty({ description: '资源类型' })
  resourceKind: ResourceKind;
}
