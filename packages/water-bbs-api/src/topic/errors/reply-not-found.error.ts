import { DomainError } from '@app/shared';
import { ReplyId } from '../entites';

export class ReplyNotFound extends DomainError {
  constructor(replyId: ReplyId) {
    super({
      key: 'exception.REPLY_NOT_FOUND',
      details: {
        replyId,
      },
    });
  }
}
