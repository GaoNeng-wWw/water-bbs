import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IdentEnum } from 'water-bbs-migration';

export class LoginDTO {
  @ApiProperty({
    enum: ['Email'],
  })
  @IsNotEmpty()
  @IsEnum(IdentEnum)
  ident_type: IdentEnum;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  ident_value: string;
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  cert_value: string;
}

export class LoginResponse {
  @ApiProperty({
    description: 'JWT,TTL: 15 Minutes. Used for accessing protected resources.',
  })
  accessToken: string;
  @ApiProperty({
    description:
      'JWT, TTL: 1 Day. Used to request `/auth/refresh` refresh AccessToken',
  })
  refreshToken: string;
}
