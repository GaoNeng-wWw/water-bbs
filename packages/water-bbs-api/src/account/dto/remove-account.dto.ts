import { ApiProperty } from '@nestjs/swagger';

export class RemoveAccountResponse {
  @ApiProperty()
  public account_id: string;
  constructor(account_id: string) {
    this.account_id = account_id;
  }
}
