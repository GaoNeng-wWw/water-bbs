import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveRole {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class RemoveRoleResponse {
  @Expose()
  id: string;
}
