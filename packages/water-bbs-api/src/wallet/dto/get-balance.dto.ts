import { ApiProperty } from '@nestjs/swagger';

export class GetBalanceResponse {
  @ApiProperty({ type: 'string', description: '钱包余额' })
  balance: string;
}
