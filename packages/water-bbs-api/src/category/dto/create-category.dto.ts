import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  parent?: string;
}

export class CreateCategoryResponse {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  hasChildren: boolean;
  @ApiProperty()
  @Expose()
  parent?: string;
  constructor(id: string, name: string, parent?: string) {
    this.id = id;
    this.name = name;
    this.parent = parent;
  }
}
