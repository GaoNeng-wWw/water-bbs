import { ApiProperty } from '@nestjs/swagger';

export class StepInfo {
  @ApiProperty({ type: 'string' })
  key: string;
  @ApiProperty({ type: 'object', additionalProperties: {} })
  ui: Record<string, any>;
  @ApiProperty({ type: 'object', additionalProperties: {} })
  param: Record<string, any>;
}
