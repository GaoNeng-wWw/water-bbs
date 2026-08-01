import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
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
}
