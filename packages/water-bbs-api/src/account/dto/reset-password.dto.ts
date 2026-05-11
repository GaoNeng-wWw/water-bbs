import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ident_value!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({})
  mfa_code!: string;
}
