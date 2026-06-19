import { Expose } from 'class-transformer';

export class ListVoteRequest {
  public readonly proposalId: string;
  constructor(proposalId: string) {
    this.proposalId = proposalId;
  }
}

export class VoteAuthor {
  @Expose()
  public readonly accountId: string;
  @Expose()
  public readonly nick: string;
  @Expose()
  public readonly avatar: string;

  constructor(accountId: string, nick: string, avatar: string) {
    this.accountId = accountId;
    this.nick = nick;
    this.avatar = avatar;
  }
}

export class VoteComment {
  @Expose()
  public readonly author: VoteAuthor;
  @Expose()
  public readonly createdAt: string;

  constructor(author: VoteAuthor, createdAt: string) {
    this.author = author;

    this.createdAt = createdAt;
  }
}
