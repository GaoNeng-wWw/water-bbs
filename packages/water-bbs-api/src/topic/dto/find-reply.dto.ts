import { IsNotEmpty, IsString } from 'class-validator';
import type { ReplyId, TopicId } from '../entites';
import type { AccountId } from '../../auth';
import { ApiProperty } from '@nestjs/swagger';

export class FindReplyDto {
  @ApiProperty({ description: '回复主题ID', type: String })
  @IsString()
  @IsNotEmpty()
  id: TopicId;
}

export class ReplyAuthor {
  @ApiProperty({ description: '回复作者ID' })
  id: AccountId;
  @ApiProperty({ description: '回复作者昵称' })
  nick: string;
}

export class ReplyInfo {
  @ApiProperty({ description: '回复ID' })
  id: ReplyId;
  @ApiProperty({ description: '回复内容' })
  content: string;
  @ApiProperty({ description: '回复作者' })
  author: ReplyAuthor;
  @ApiProperty({ description: '回复创建时间' })
  createdAt: Date;
}

export class ReplyItem {
  @ApiProperty({ description: '回复ID' })
  id: ReplyId;
  @ApiProperty({ description: '回复内容' })
  content: string;
  @ApiProperty({ description: '回复作者' })
  author: ReplyAuthor;
  @ApiProperty({ description: '回复创建时间' })
  createdAt: string;
  constructor(reply: ReplyInfo) {
    this.id = reply.id;
    this.content = reply.content;
    this.author = reply.author;
    this.createdAt = reply.createdAt.toLocaleTimeString();
  }
}
