export class PublicAccountInfo {
  public account_id: string;
  public username: string;
  public bio: string;
  constructor(account_id: string, username: string, bio?: string) {
    this.account_id = account_id;
    this.username = username;
    this.bio = bio ?? '';
  }
}
