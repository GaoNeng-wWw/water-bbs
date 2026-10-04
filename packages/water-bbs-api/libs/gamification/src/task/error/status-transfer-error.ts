import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class StatusTransferError extends DomainError {
  constructor(exception: string[], current: string[]) {
    super({
      key: 'exception.USER_TASK_STATUS_TRANS_ERROR',
      status: HttpStatus.BAD_REQUEST,
      args: {
        exceptionStatus: exception.join(' or'),
        currentStatus: current.join(' or'),
      },
    });
  }
}
