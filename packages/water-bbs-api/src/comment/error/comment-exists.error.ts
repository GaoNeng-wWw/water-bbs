import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class CommentAlreadyExists extends DomainError {
  constructor() {
    super({
      key: 'exception.COMMENT_ALREADY_EXISTS',
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
