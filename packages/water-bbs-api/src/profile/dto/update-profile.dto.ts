import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfile {
  @ApiProperty({ description: '昵称' })
  @IsString()
  @IsOptional()
  nick?: string;
  @ApiProperty({ description: '个人简介' })
  @IsString()
  @IsOptional()
  bio?: string;
}
