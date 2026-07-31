import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '回复内容' })
  content: string;
}
