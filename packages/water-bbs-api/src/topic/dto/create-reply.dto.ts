import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty()
  @ApiProperty({ description: '回复内容' })
  content: Record<string, any>;
}
