import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthorProfile {
  @Expose()
  @ApiProperty()
  id: string;
  @Expose()
  @ApiProperty()
  name: string;
  @Expose()
  @ApiProperty()
  avatar?: string;
  @Expose()
  @ApiProperty()
  bio?: string;
  constructor(id: string, name: string, avatar?: string, bio?: string) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.bio = bio;
  }
}
export class ProposalEntity {
  @Expose()
  @ApiProperty()
  id: string;
  @Expose()
  @ApiProperty()
  title: string;
  @Expose()
  @ApiProperty()
  content: string;
  @Expose()
  @ApiProperty({ description: '支持方占比' })
  yes: number;
  @Expose()
  @ApiProperty({ description: '反对方占比' })
  no: number;
  constructor(
    id: string,
    title: string,
    content: string,
    yes: number,
    no: number,
  ) {
    this.id = id;
    this.content = content;
    this.yes = yes;
    this.no = no;
    this.title = title;
    this.content = content;
    this.yes = yes;
    this.no = no;
  }
}
