import { ApiProperty } from '@nestjs/swagger';

export class GetProfileResponse {
  @ApiProperty({ description: 'Account ID' })
  public id: string;
  @ApiProperty()
  public username: string;
  @ApiProperty()
  public bio: string;
  @ApiProperty()
  public avatar: string;
  constructor(id: string, username: string, bio?: string, avatar?: string) {
    this.id = id;
    this.username = username;
    this.bio = bio ?? '';
    this.avatar = avatar ?? '';
  }
}
