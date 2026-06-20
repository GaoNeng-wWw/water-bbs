import { DomainError } from 'water-bbs-shared';

export class UnsupportedStorageEngine extends DomainError {
  constructor() {
    super('UNSUPPORTED_STORAGE_ENGINE');
  }
}
