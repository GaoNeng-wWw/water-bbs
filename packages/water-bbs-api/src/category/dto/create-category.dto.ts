import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
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
  @ApiProperty({ nullable: true, required: false })
  @Expose()
  parentId?: string | null;
  constructor(id: string, name: string, parentId?: string) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
  }
}
