import { DomainError } from '@app/shared';
import { ReplyId } from '../entites';
import { HttpStatus } from '@nestjs/common';

export class ReplyNotFound extends DomainError {
  constructor(replyId: ReplyId) {
    super({
      key: 'exception.REPLY_NOT_FOUND',
      details: {
        replyId,
      },
      status: HttpStatus.NOT_FOUND,
    });
  }
}
