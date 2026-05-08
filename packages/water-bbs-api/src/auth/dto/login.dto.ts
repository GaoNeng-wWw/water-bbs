import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IdentEnum } from 'water-bbs-migration';

export class LoginDTO {
  @IsNotEmpty()
  @IsEnum(IdentEnum)
  ident_type: IdentEnum;
  @IsNotEmpty()
  @IsString()
  ident_value: string;
  @IsNotEmpty()
  @IsString()
  cert_value: string;
}
