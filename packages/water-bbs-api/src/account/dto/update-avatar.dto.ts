import { Expose } from 'class-transformer';

export class UpdateAvatarResponse {
  @Expose()
  url: string;
  constructor(url: string) {
    this.url = url;
  }
}
