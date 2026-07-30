import { ApiProperty } from '@nestjs/swagger';
import type { CategoryId } from '../entities';

export class RemoveCategoryResponse {
  @ApiProperty({ type: String })
  id: CategoryId;
}
