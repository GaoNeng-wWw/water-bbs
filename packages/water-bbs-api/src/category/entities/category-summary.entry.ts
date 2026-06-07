import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategorySummary {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty({ nullable: true, required: false })
  @Expose()
  parentId?: string | null;
  @ApiProperty()
  @Expose()
  hasChildren: boolean;

  constructor(
    id: string,
    name: string,
    hasChildren: boolean,
    parentId?: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.hasChildren = hasChildren;
  }
}
