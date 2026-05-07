export class GetProfileDTO {
  public id: string;
  public username: string;
  public bio: string;
  public avatar: string;
  constructor(id: string, username: string, bio?: string, avatar?: string) {
    this.id = id;
    this.username = username;
    this.bio = bio ?? '';
    this.avatar = avatar ?? '';
  }
}
