import { Expose } from 'class-transformer';
import { VoteAction } from 'water-bbs-migration';

export class CreateVoteDTO {
  constructor(
    public proposalId: string,
    public accountId: string,
    public comment: string,
    public action: VoteAction,
  ) {}
}

export class CreateVoteResponse {
  @Expose()
  public readonly voteId: string;
  constructor(voteId: string) {
    this.voteId = voteId;
  }
}
