import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDTO {
  @ApiProperty({})
  username?: string;
  @ApiProperty({})
  bio?: string;
}

export class UpdateProfileResponse {
  @ApiProperty({})
  public account_id: string;
  @ApiProperty({})
  public username: string;
  @ApiProperty({})
  public bio: string;
  constructor(account_id: string, username?: string, bio?: string) {
    this.account_id = account_id;
    this.username = username ?? '';
    this.bio = bio ?? '';
  }
}
