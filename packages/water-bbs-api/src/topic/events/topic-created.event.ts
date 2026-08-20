import { CategoryId } from 'src/category';
import { AccountId } from '../../auth';
import { TopicId } from '../entites';
import { IEvent } from '@nestjs/cqrs';

export class TopicCreated implements IEvent {
  id = 'topic.created';
  constructor(
    public readonly authorId: AccountId,
    public readonly topicId: TopicId,
    public readonly categoryId: CategoryId,
  ) {}
}
