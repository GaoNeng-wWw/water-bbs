import { PaginationData } from '@app/shared';
import { TopicInfo } from './find-topic.dto';

export class ListTopicResponse extends PaginationData<TopicInfo> {
  constructor(data: TopicInfo[], total: number) {
    super(data, total);
  }
}
