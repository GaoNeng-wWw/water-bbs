import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';
import { TopicId } from '../entites';

export class TopicNotFound extends DomainError {
  constructor(id: TopicId) {
    super({
      key: 'exception.TOPIC_NOT_FOUND',
      status: HttpStatus.NOT_FOUND,
      detail: { id },
    });
  }
}
