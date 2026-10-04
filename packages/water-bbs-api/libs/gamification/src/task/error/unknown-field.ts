import { DomainError } from '@app/shared';

export class UnknownField extends DomainError {
  constructor(name: string) {
    super({
      key: 'exception.UNKNOWN_CEL_FIELD',
      args: { name },
    });
  }
}
