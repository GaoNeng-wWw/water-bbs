import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import type { CategoryId } from '../../category';
import type { TopicId } from '../entites';

export class UpdateTopicDto {
  @ApiProperty({ description: '主题标题' })
  @IsString()
  @IsString()
  title: string;
  @ApiProperty({ description: '主题内容' })
  @IsString()
  content: string;
  @ApiProperty({ description: '是否置顶' })
  @IsBoolean()
  @IsOptional()
  pinned?: boolean;
  @ApiProperty({ description: '分类ID' })
  @IsString()
  @IsOptional()
  categoryId?: CategoryId;
}

export class UpdateTopicResponse {
  @ApiProperty({ description: '主题ID', type: String })
  @IsString()
  id: TopicId;
}
