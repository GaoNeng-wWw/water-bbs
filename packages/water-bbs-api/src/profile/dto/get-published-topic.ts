import { PaginationData } from '@app/shared';
import type { TopicId } from '../../topic';
import { ApiProperty } from '@nestjs/swagger';

export type TopicInfoProps = {
  id: TopicId;
  title: string;
  content: string;
  createdAt: Date;
};

export class TopicInfo {
  @ApiProperty({ description: '主题ID' })
  id: TopicId;
  @ApiProperty({ description: '主题标题' })
  title: string;
  @ApiProperty({ description: '主题内容' })
  content: string;
  @ApiProperty({ description: '创建时间' })
  createdAt: string;
  constructor(props: TopicInfoProps) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.createdAt = props.createdAt.toLocaleTimeString();
  }
}

export class UserPublishedTopicList extends PaginationData<TopicInfo> {
  constructor(data: TopicInfo[], total: number) {
    super(data, total);
  }
}
