import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import type { AccountId } from '../entites';

export class RegisterProfile {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '昵称' })
  nick: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '个人简介' })
  bio?: string;
}

export class RegisterResponse {
  @IsString()
  @ApiProperty({ description: '账号ID' })
  accountId: AccountId;
}

export class RegisterRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '标识类型' })
  identType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @ApiProperty({ description: '标识值' })
  identValue: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '凭证类型' })
  credentialType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '凭证值' })
  credentialValue: string;

  @ValidateNested()
  @Type(() => RegisterProfile)
  @ApiProperty({ type: RegisterProfile, description: '个人信息' })
  profile: RegisterProfile;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '验证码', required: false })
  verificationCode?: string;
}
