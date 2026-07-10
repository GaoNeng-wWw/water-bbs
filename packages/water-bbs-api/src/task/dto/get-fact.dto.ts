import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FactInfo {
  @Expose()
  @ApiProperty()
  name: string;
  @ApiProperty()
  @Expose()
  returnType: Record<string, any>;
}
