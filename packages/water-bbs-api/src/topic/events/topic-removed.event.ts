import { CategoryId } from 'src/category';
import { AccountId } from '../../auth';
import { TopicId } from '../entites';

export class TopicRemoved {
  constructor(
    public readonly authorId: AccountId,
    public readonly topicId: TopicId,
    public readonly categoryId: CategoryId,
  ) {}
}
