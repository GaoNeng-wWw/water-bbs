import { AccountId } from '../../auth';
import { TopicId } from '../entites';

export class TopicAuthor {
  id: AccountId;
  nick: string;
  constructor(props: TopicAuthor) {
    Object.assign(this, props);
  }
}

export type TopicInfoProps = {
  id: TopicId;
  title: string;
  content: string;
  author: TopicAuthor;
  createdAt: Date;
};

export class TopicInfo {
  id: TopicId;
  title: string;
  content: string;
  author: TopicAuthor;
  createdAt: string;
  constructor(props: TopicInfoProps) {
    Object.assign(this, props);
    this.createdAt = props.createdAt.toLocaleTimeString();
  }
}
