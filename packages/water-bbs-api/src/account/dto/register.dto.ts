import { IdentEnum } from 'water-bbs-migration';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  username!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
  @IsNotEmpty()
  @IsString()
  @IsEnum(IdentEnum)
  ident_type!: IdentEnum;
  @IsNotEmpty()
  @IsString()
  ident_value!: string;
  @IsString()
  captcha?: string;
  @IsString()
  invite_code?: string;
}
