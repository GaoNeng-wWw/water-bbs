import { DomainError } from '@app/shared';
import { CommentId } from '../comment.entity';
import { HttpStatus } from '@nestjs/common';

export class CommentNotFound extends DomainError {
  constructor(public readonly commentId?: CommentId) {
    super({
      key: 'exception.COMMENT_NOT_FOUND',
      details: { commentId },
      status: HttpStatus.NOT_FOUND,
    });
  }
}
