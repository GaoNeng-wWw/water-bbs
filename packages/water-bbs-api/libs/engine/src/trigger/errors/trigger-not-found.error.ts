import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';
import { TriggerId } from '../trigger.entity';

export class TriggerNotFound extends DomainError {
  constructor(id: TriggerId) {
    super({
      key: 'exception.INTERNAL_ERROR',
      status: HttpStatus.NOT_FOUND,
      details: { id },
    });
  }
}
