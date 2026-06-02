import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProposalSummary {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  title: string;
  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}
