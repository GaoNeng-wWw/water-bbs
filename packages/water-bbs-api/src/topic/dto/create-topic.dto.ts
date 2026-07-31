import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ description: '主题标题' })
  @IsString()
  @IsString()
  title: string;
  @ApiProperty({ description: '主题内容' })
  @IsString()
  content: string;
}
