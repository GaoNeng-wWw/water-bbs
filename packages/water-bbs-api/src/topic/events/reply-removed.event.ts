import { IEvent } from '@nestjs/cqrs';
import { ReplyId, TopicId } from '../entites';

export class ReplyRemoved implements IEvent {
  id = 'topic.reply-removed';
  constructor(
    public topicId: TopicId,
    public replyId: ReplyId,
  ) {}
}
