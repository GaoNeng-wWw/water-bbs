import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TransactionSubject {
  @ApiProperty()
  @Expose()
  system: boolean;
  @ApiProperty()
  @Expose()
  id?: string;

  constructor(props: TransactionSubject) {
    Object.assign(this, props);
  }
}
export class TransactionItem {
  @ApiProperty()
  public readonly subject: TransactionSubject;
  @ApiProperty()
  public readonly cost: string;
  @ApiProperty()
  public readonly createdAt: string;
  @ApiProperty()
  public readonly out: boolean;
  constructor(props: TransactionItem) {
    Object.assign(this, props);
  }
}
