import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterProfile {
  @IsString()
  @IsNotEmpty()
  nick: string;

  @IsString()
  @IsNotEmpty()
  bio: string;
}

export class RegisterRequest {
  @IsString()
  @IsNotEmpty()
  identType: string;

  @IsString()
  @IsNotEmpty()
  identValue: string;

  @IsString()
  @IsNotEmpty()
  credentialType: string;

  @IsString()
  @IsNotEmpty()
  credentialValue: string;

  @ValidateNested()
  @Type(() => RegisterProfile)
  profile: RegisterProfile;
}
