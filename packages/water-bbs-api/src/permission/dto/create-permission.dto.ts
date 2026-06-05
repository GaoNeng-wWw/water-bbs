import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreatePermissionResponse {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  code: string;
  @ApiProperty()
  @Expose()
  name: string;
}
