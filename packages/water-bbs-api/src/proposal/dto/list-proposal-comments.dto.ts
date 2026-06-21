import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { VoteAction } from 'water-bbs-migration';

export class CommentAuthor {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  nick: string;
  @ApiProperty()
  @Expose()
  avatar: string;
}

export class ProposalComment {
  @ApiProperty()
  @Expose()
  commentId: string;
  @ApiProperty()
  @Expose()
  content: string;
  @ApiProperty()
  @Expose()
  author: CommentAuthor;
  @ApiProperty()
  @Expose()
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;
  @ApiProperty({ enum: () => VoteAction })
  @Expose()
  action?: VoteAction;
}
