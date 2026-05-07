import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  ident_value!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
  @IsString()
  @IsNotEmpty()
  mfa_code!: string;
}
