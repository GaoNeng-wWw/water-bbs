import { IsNotEmpty, IsString } from 'class-validator';
import type { ReplyId, TopicId } from '../entites';
import { AccountId } from '../../auth';

export class FindReplyDto {
  @IsString()
  @IsNotEmpty()
  id: TopicId;
}

export interface ReplyAuthor {
  id: AccountId;
  nick: string;
}

export interface ReplyInfo {
  id: ReplyId;
  content: string;
  author: ReplyAuthor;
  createdAt: Date;
}

export class ReplyItem {
  id: ReplyId;
  content: string;
  author: ReplyAuthor;
  createdAt: string;
  constructor(reply: ReplyInfo) {
    this.id = reply.id;
    this.content = reply.content;
    this.author = reply.author;
    this.createdAt = reply.createdAt.toLocaleTimeString();
  }
}
