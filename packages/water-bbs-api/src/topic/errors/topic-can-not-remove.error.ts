import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TopicCanNotRemove extends DomainError {
  constructor() {
    super({
      key: 'exception.TOPIC_CAN_NOT_REMOVE',
      status: HttpStatus.FORBIDDEN,
    });
  }
}
