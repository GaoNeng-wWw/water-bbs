import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleParam {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class UpdateRole {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString({ each: true })
  permissionCodes?: string[];
}

export class UpdateRoleResponse {
  @Expose()
  id: string;
}
