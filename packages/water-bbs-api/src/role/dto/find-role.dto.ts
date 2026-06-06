import { IsNotEmpty, IsString } from 'class-validator';

export class FindRole {
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class RoleInfoPermission {
  @IsNotEmpty()
  @IsString()
  code: string;
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FindRoleResponse {
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  code: string;
  @IsNotEmpty()
  @IsString({ each: true })
  permissions: RoleInfoPermission[];
}
