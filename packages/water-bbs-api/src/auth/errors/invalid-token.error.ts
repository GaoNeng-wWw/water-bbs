import { DomainError } from '@app/shared';

export class InvalidToken extends DomainError {
  constructor(cause?: Error) {
    super({
      key: 'excpetion.INVALID_TOKEN',
      cause,
    });
  }
}
