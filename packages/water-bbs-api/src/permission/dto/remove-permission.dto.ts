import { IsNotEmpty, IsString } from 'class-validator';

export class RemovePermission {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class RemovePermissionResponse {
  @IsNotEmpty()
  @IsNotEmpty()
  id: string;
}
