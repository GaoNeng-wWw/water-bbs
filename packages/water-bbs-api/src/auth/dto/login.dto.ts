import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  ident_type: string;
  @IsNotEmpty()
  @IsString()
  ident_value: string;
  @IsNotEmpty()
  @IsString()
  cert_value: string;
}