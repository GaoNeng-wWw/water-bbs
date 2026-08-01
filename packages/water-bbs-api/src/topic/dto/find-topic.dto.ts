import { ApiProperty } from '@nestjs/swagger';
import type { AccountId } from '../../auth';
import type { TopicId } from '../entites';

export class TopicAuthor {
  @ApiProperty({ description: '主题作者ID' })
  id: AccountId;
  @ApiProperty({ description: '主题作者昵称' })
  nick: string;
  constructor(props: TopicAuthor) {
    Object.assign(this, props);
  }
}

export class TopicInfoProps {
  @ApiProperty({ description: '主题ID' })
  id: TopicId;
  @ApiProperty({ description: '主题标题' })
  title: string;
  @ApiProperty({ description: '主题内容' })
  content: string;
  @ApiProperty({ description: '主题作者' })
  author: TopicAuthor;
  @ApiProperty({ description: '主题创建时间' })
  createdAt: Date;
  @ApiProperty({ description: '主题是否置顶' })
  pinned: boolean;
  @ApiProperty({ description: '主题回复总数' })
  replyTotal: number;
}

export class TopicInfo {
  @ApiProperty({ description: '主题ID' })
  id: TopicId;
  @ApiProperty({ description: '主题标题' })
  title: string;
  @ApiProperty({ description: '主题内容' })
  content: string;
  @ApiProperty({ description: '主题作者' })
  author: TopicAuthor;
  @ApiProperty({ description: '主题创建时间' })
  createdAt: string;
  @ApiProperty({ description: '主题是否置顶' })
  pinned: boolean;
  @ApiProperty({ description: '主题回复总数' })
  replyTotal: number;
  constructor(props: TopicInfoProps) {
    Object.assign(this, props);
    this.createdAt = props.createdAt.toLocaleTimeString();
  }
}
