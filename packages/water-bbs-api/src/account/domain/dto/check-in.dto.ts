import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckInResponse {
  @ApiProperty()
  @Expose()
  balance: number;
}
export class GetCheckInResponse {
  @ApiProperty()
  @Expose()
  checked: boolean;
}
