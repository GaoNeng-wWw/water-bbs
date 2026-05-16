import { Expose } from 'class-transformer';

export class UpdateProfileDTO {
  username?: string;
  bio?: string;
}

export class UpdateProfileResponse {
  @Expose()
  public account_id: string;
  @Expose()
  public username: string;
  @Expose()
  public bio: string;
  constructor(account_id: string, username?: string, bio?: string) {
    this.account_id = account_id;
    this.username = username ?? '';
    this.bio = bio ?? '';
  }
}
