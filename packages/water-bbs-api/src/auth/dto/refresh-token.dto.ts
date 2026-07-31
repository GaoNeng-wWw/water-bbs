import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty({ type: 'string', description: '刷新令牌' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
