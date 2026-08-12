import { ApiProperty } from '@nestjs/swagger';
import type { AccountId } from '../../auth';
import type { TopicId } from '../entites';
import type { CategoryId } from 'src/category';

export class TopicAuthor {
  @ApiProperty({ description: '主题作者ID', type: String })
  id: AccountId;
  @ApiProperty({ description: '主题作者昵称' })
  nick: string;
  constructor(props: TopicAuthor) {
    Object.assign(this, props);
  }
}

export class TopicCategory {
  @ApiProperty({ description: '分类ID', type: String })
  id: CategoryId;
  @ApiProperty({ description: '分类名称', type: String })
  name: string;
  @ApiProperty({ description: '分类颜色', type: String })
  color: string;
  constructor(props: TopicCategory) {
    this.id = props.id;
    this.name = props.name;
    this.color = props.color;
  }
}

export class TopicInfoProps {
  @ApiProperty({ description: '主题ID', type: String })
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
  @ApiProperty({ description: '主体所属分类' })
  category: TopicCategory;
}

export class TopicInfo {
  @ApiProperty({ description: '主题ID', type: String })
  id: TopicId;
  @ApiProperty({ description: '主题标题' })
  title: string;
  @ApiProperty({ description: '主题内容' })
  content: string;
  @ApiProperty({ description: '主题作者', type: TopicAuthor })
  author: TopicAuthor;
  @ApiProperty({ description: '主题创建时间' })
  createdAt: string;
  @ApiProperty({ description: '主题是否置顶' })
  pinned: boolean;
  @ApiProperty({ description: '主题回复总数' })
  replyTotal: number;
  @ApiProperty({ description: '主体所属分类' })
  category: TopicCategory;
  constructor(props: TopicInfoProps) {
    Object.assign(this, props);
    this.createdAt = props.createdAt.toString();
  }
}
