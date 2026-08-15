import { ApiProperty } from '@nestjs/swagger';

export class ListTransactionsItem {
  @ApiProperty({ type: 'string', description: '交易ID' })
  id: string;
  @ApiProperty({ type: 'string', description: '交易发起人' })
  from: string;
  @ApiProperty({ type: 'string', description: '交易接收人' })
  to: string;
  @ApiProperty({ type: 'string', description: '交易金额' })
  amount: string;
  @ApiProperty({ type: 'string', description: '交易详情' })
  detail: string;
}

export class ListTransactionsResponse {
  @ApiProperty({ type: () => [ListTransactionsItem], description: '交易列表' })
  items: ListTransactionsItem[];
  @ApiProperty({ type: 'string', description: '下一页交易ID' })
  nextCursor?: string;
}
