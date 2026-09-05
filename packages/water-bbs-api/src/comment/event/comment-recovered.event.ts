import { IEvent } from '@nestjs/cqrs';
import { CommentId } from '../comment.entity';

export class CommentRecoveredEvent implements IEvent {
  id = 'comment.recovered'
  constructor(public readonly commentId: CommentId) {}
}
