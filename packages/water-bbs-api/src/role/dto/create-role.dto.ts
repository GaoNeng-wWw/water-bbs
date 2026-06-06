import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRole {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  code: string;
  @IsNotEmpty()
  @IsString({ each: true })
  permissionCodes: string[];
}

export class CreateRoleResponse {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  code: string;
}
