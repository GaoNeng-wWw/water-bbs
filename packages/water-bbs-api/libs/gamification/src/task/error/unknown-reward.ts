import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class UnknownReward extends DomainError {
  constructor(name: string) {
    super({
      key: 'exception.UNKNOWN_REWARD',
      args: { name },
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
