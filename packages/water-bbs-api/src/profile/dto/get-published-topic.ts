import { PaginationData } from '@app/shared';
import type { TopicId } from '../../topic';
import { ApiProperty } from '@nestjs/swagger';
import type { CategoryId } from '../../category';

export class TopicCategory {
  @ApiProperty({ description: '分类ID', type: String })
  id: CategoryId;
  @ApiProperty({ description: '分类名称' })
  name: string;
  @ApiProperty({ description: '分类颜色' })
  color?: string;
  constructor(props: { id: CategoryId; name: string; color?: string }) {
    this.id = props.id;
    this.name = props.name;
    this.color = props.color;
  }
}

export type ProfileTopicInfoProps = {
  id: TopicId;
  title: string;
  content: string;
  createdAt: Date;
  category: TopicCategory;
  repliesTotal: number;
};

export class ProfileTopicInfo {
  @ApiProperty({ description: '主题ID', type: String })
  id: TopicId;
  @ApiProperty({ description: '主题标题' })
  title: string;
  @ApiProperty({ description: '主题内容' })
  content: string;
  @ApiProperty({ description: '创建时间' })
  createdAt: string;
  @ApiProperty({ description: '分类' })
  category: TopicCategory;
  @ApiProperty({ description: '回复总数' })
  repliesTotal: number;
  constructor(props: ProfileTopicInfoProps) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.createdAt = props.createdAt.toLocaleTimeString();
    this.category = props.category;
    this.repliesTotal = props.repliesTotal;
  }
}

export class UserPublishedTopicList extends PaginationData<ProfileTopicInfo> {
  constructor(data: ProfileTopicInfo[], total: number) {
    super(data, total);
  }
}
