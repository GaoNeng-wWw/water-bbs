import { DomainError } from 'water-bbs-shared';

export class ValidateFailError extends DomainError {
  constructor(source?: Error) {
    super('VALIDATE_FAIL', source);
  }
}
