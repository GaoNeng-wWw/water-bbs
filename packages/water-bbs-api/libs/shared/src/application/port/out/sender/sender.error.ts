import { InfrastructureError } from 'water-bbs-shared';

export class SenderError extends InfrastructureError {
  constructor(reason: string) {
    super('SENDER_ERROR', null, { reason });
  }
}
