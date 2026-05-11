import { IdentEnum } from 'water-bbs-migration';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Jack' })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'example' })
  password!: string;
  @IsNotEmpty()
  @IsString()
  @IsEnum(IdentEnum)
  @ApiProperty({ enum: IdentEnum })
  ident_type!: IdentEnum;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'example@example.org' })
  ident_value!: string;
  @IsString()
  @ApiProperty({ description: 'The mail / sms captcha.' })
  captcha?: string;
  @IsString()
  @ApiProperty({ description: 'iff enable_invite flag true will required' })
  invite_code?: string;
}

export class CreateAccountResponse {
  @ApiProperty()
  public account_id: string;
  constructor(account_id: string) {
    this.account_id = account_id;
  }
}
