import { ApplicationServiceError } from 'water-bbs-shared';

export class UnsupportedIdentType extends ApplicationServiceError {
  constructor(identType: string) {
    super('UNSUPPORTED_IDENT_TYPE', 400, null, { identType });
  }
}
