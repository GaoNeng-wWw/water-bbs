import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetProfileResponse {
  @Expose()
  @ApiProperty({ description: 'Account ID' })
  public id: string;
  @Expose()
  @ApiProperty()
  public username: string;
  @Expose()
  @ApiProperty()
  public bio: string;
  @Expose()
  @ApiProperty()
  public avatar: string;
  constructor(id: string, username: string, bio?: string, avatar?: string) {
    this.id = id;
    this.username = username;
    this.bio = bio ?? '';
    this.avatar = avatar ?? '';
  }
}
