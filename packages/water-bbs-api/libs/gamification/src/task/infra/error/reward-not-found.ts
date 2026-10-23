import { InfraError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class RewardNotFound extends InfraError {
  constructor(name: string) {
    super({
      key: 'exception.REWARD_NOT_FOUND',
      args: { name },
      status: HttpStatus.NOT_FOUND
    });
  }
}
