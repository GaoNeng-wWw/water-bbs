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
  @ApiProperty()
  @Expose()
  yes: number;
  @ApiProperty()
  @Expose()
  no: number;
  @ApiProperty()
  @Expose()
  total: number;
  @ApiProperty()
  @Expose()
  createdAt: string;
  @ApiProperty()
  @Expose()
  endAt: string;
  constructor(
    id: string,
    title: string,
    status: ProposalStatus,
    yes: number,
    no: number,
    total: number,
    createdAt: string,
    endAt: string,
  ) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.yes = yes;
    this.no = no;
    this.total = total;
    this.createdAt = createdAt;
    this.endAt = endAt;
  }
}
