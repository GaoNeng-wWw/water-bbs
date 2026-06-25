import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetBalanceResponse {
  @ApiProperty()
  @Expose()
  balance: string;
}
