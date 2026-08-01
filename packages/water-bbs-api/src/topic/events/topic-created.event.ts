import { AccountId } from '../../auth';
import { TopicId } from '../entites';

export class TopicCreated {
  constructor(
    public readonly authorId: AccountId,
    public readonly topicId: TopicId,
  ) {}
}
