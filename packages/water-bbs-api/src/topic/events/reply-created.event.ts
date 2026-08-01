import { AccountId } from '../../auth';
import { ReplyId, TopicId } from '../entites';

export class ReplyCreated {
  constructor(
    public topicId: TopicId,
    public replyId: ReplyId,
    public authorId: AccountId,
  ) {}
}
