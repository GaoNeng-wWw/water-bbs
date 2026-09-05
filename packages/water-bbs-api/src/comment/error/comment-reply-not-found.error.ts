import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';
import { ReplyId } from '../comment.entity';

export class CommentReplyNotFound extends DomainError {
  constructor(public readonly id: ReplyId) {
    super({
      status: HttpStatus.NOT_FOUND,
      key: 'exception.COMMENT_REPLY_NOT_FOUND',
    });
  }
}
