import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class FindPermissionDTO {
  @ApiProperty()
  @IsString()
  code: string;
}

export class FindPermissionResponse {
  @Expose()
  @ApiProperty()
  id: string;
  @Expose()
  @ApiProperty()
  code: string;
  @Expose()
  @ApiProperty()
  name: string;
}
