import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ProposalStatus } from 'water-bbs-migration';

export class ProposalSummary {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  title: string;
  @ApiProperty({ enum: ProposalStatus })
  @Expose()
  status: ProposalStatus;
  constructor(id: string, title: string, status: ProposalStatus) {
    this.id = id;
    this.title = title;
    this.status = status;
  }
}
