import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class RewardParamError extends DomainError {
  constructor(cause?: Error) {
    super({
      status: HttpStatus.BAD_GATEWAY,
      key: 'exception.REWARD_PARAM_ERROR',
      cause,
    });
  }
}
