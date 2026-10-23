import { ApplicationError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class DeliverConditionUnmet extends ApplicationError {
  constructor() {
    super({
      key: 'exception.DELIVERY_CONDITION_UNMET',
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
