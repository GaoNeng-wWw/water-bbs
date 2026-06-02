import { DomainError } from 'water-bbs-shared';

export class CanNotFoundHandlerError extends DomainError {
  constructor() {
    super('CAN_NOT_FOUND_HANDLER');
  }
}
