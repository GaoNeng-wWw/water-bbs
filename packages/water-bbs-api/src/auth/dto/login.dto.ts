import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ description: '标识类型' })
  @IsString()
  @IsNotEmpty()
  identType: string;

  @ApiProperty({ description: '标识值' })
  @IsString()
  @IsNotEmpty()
  identValue: string;

  @ApiProperty({ description: '凭证类型' })
  @IsString()
  @IsNotEmpty()
  credentialType: string;

  @ApiProperty({ description: '凭证值' })
  @IsString()
  @IsNotEmpty()
  credentialValue: string;
}

export class TokenPair {
  @ApiProperty({ description: '访问令牌, 用于访问受到保护的资源' })
  accessToken: string;
  @ApiProperty({ description: '刷新令牌, 用于刷新访问令牌' })
  refreshToken: string;
  @ApiProperty({ description: '访问令牌有效期 (秒)' })
  accessTokenTTL: number;
  @ApiProperty({ description: '刷新令牌有效期 (秒)' })
  refreshTokenTTL: number;
  constructor(props: TokenPair) {
    this.accessToken = props.accessToken;
    this.accessTokenTTL = props.accessTokenTTL;
    this.refreshToken = props.refreshToken;
    this.refreshTokenTTL = props.refreshTokenTTL;
  }
}
