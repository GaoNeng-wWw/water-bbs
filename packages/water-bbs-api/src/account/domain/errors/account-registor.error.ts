import { DomainError } from 'water-bbs-shared';

export class UnsupportedIdentType extends DomainError {
  constructor(identType: string) {
    super('UNSUPPORTED_IDENT_TYPE', null, { identType });
  }
}
