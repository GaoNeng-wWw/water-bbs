import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class UnknownScheduleKind extends DomainError {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      key: 'exception.UNKNOWN_SCHEDULE_KIND',
    });
  }
}