import { ReplyId, TopicId } from '../entites';

export class ReplyRemoved {
  constructor(
    public topicId: TopicId,
    public replyId: ReplyId,
  ) {}
}
