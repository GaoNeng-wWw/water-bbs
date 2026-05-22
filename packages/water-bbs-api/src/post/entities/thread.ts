import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ThreadAuthorSummary {
  @ApiProperty()
  @Expose()
  public id: string;
  @ApiProperty()
  @Expose()
  public name: string;
  @ApiProperty()
  @Expose()
  public bio?: string;
  @ApiProperty()
  @Expose()
  public avatar?: string;
  constructor(id: string, name: string, bio?: string, avatar?: string) {
    this.id = id;
    this.name = name;
    this.bio = bio;
    this.avatar = avatar;
  }
}
export class Thread {
  @ApiProperty()
  @Expose()
  public id: string;
  @ApiProperty()
  @Expose()
  public author: ThreadAuthorSummary;
  @ApiProperty()
  @Expose()
  public content: string;
  @ApiProperty()
  @Expose()
  public createdAt: string;
  constructor(
    id: string,
    author: ThreadAuthorSummary,
    content: string,
    createdAt: string,
  ) {
    this.id = id;
    this.author = author;
    this.content = content;
    this.createdAt = createdAt;
  }
}
