import { DomainError } from 'water-bbs-shared';

export class RemoveFileFail extends DomainError {
  constructor(err?: Error) {
    super('REMOVE_FILE_FAIL', err ?? null);
  }
}
