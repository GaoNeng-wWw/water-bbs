import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ActionInfo {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  schema: Record<string, any>;
  constructor(name: string, schema: Record<string, any>) {
    this.name = name;
    this.schema = schema;
  }
}
