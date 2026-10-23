import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TaskCooldownNotExpired extends DomainError {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      key: 'exception.TASK_COOLDOWN_NOT_EXPIRED',
      details: {},
      args: {},
    });
  }
}