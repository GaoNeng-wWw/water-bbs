import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RewardSummary {
  @ApiProperty()
  @Expose()
  code: string;
  @ApiProperty()
  @Expose()
  label: string;
  @ApiProperty()
  @Expose()
  description: string;
  @ApiProperty()
  @Expose()
  schema: Record<string, any>;
}
