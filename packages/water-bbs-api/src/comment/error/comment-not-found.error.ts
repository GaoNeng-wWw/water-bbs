import { DomainError } from '@app/shared';
import { CommentId } from '../comment.entity';

export class CommentNotFound extends DomainError {
  constructor(public readonly commentId: CommentId) {
    super({
      key: 'COMMENT_NOT_FOUND',
      details: { commentId },
    });
  }
}
