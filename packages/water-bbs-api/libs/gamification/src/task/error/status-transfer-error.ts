import { DomainError } from '@app/shared';

export class StatusTransferError extends DomainError {
  constructor(exception: string[], current: string[]) {
    super({
      key: 'exception.USER_TASK_STATUS_TRANS_ERROR',
      args: {
        exceptionStatus: exception.join(' or'),
        currentStatus: current.join(' or'),
      },
    });
  }
}
