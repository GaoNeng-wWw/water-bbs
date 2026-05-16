import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  parent?: string | null;
}

export class UpdateCategoryResponse {
  @ApiProperty()
  @Expose()
  id: string;
}
