import { DomainError } from './error.base';

export class ReasonRequiredError extends DomainError {
  constructor() {
    super({
      key: 'exception.HIDDEN_REASON_REQUIRED',
    });
  }
}

export class EndMustAfterAfterStartError extends DomainError {
  constructor() {
    super({
      key: 'exception.HIDDEN_END_MUST_BE_AFTER_START',
    });
  }
}
