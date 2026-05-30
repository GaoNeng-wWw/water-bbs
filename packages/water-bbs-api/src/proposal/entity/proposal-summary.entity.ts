import { Expose } from 'class-transformer';

export class ProposalSummary {
  @Expose()
  id: string;
  @Expose()
  title: string;
  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}
