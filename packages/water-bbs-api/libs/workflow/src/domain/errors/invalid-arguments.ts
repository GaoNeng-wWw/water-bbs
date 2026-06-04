import { DomainError } from 'water-bbs-shared';

export class InvalidArguments extends DomainError {
  constructor(args: Record<string, any>) {
    super('INVALID_ARGUMENTS', null, args);
  }
}
