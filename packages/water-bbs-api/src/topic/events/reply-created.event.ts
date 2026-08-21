import { AccountId } from '../../auth';
import { ReplyId, TopicId } from '../entites';

export class ReplyCreated {
  id = 'topic.reply-created';
  constructor(
    public topicId: TopicId,
    public replyId: ReplyId,
    public authorId: AccountId,
  ) {}
}
