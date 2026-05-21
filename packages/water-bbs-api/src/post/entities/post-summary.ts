import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AuthorSummary {
  @ApiProperty()
  @Expose()
  public readonly id: string;
  @ApiProperty()
  @Expose()
  public readonly name: string;
  @ApiPropertyOptional()
  @Expose()
  public readonly avatar?: string;
  constructor(id: string, name: string, avatar?: string) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
  }
}

export class PostSummary {
  @ApiProperty()
  @Expose()
  public readonly id: string;
  @ApiProperty()
  @Expose()
  public readonly title: string;
  @ApiProperty()
  @Expose()
  public readonly content: string;
  @ApiProperty()
  @Expose()
  @Type(() => AuthorSummary)
  public readonly author: AuthorSummary;
  @ApiProperty()
  @Expose()
  public readonly createdAt: string;
  constructor(
    id: string,
    title: string,
    content: string,
    author: AuthorSummary,
    createdAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    if (createdAt) {
      this.createdAt = createdAt.toLocaleDateString();
    }
  }
}
