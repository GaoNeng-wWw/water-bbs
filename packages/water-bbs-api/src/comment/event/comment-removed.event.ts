import { IEvent } from '@nestjs/cqrs';
import { CommentId } from '../comment.entity';

export class CommentRemovedEvent implements IEvent {
  id = 'comment.removed';
  constructor(public readonly commentId: CommentId) {}
}
