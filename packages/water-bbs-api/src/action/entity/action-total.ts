import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ActionTotal {
  @Expose()
  @ApiProperty()
  value: number;

  constructor(value: number) {
    this.value = value;
  }
}
