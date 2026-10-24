import { ApplicationError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';
export class StorageNotFound extends ApplicationError {
  constructor() {
    super({
      key: 'exception.STORAGE_NOT_FOUND',
      status: HttpStatus.NOT_FOUND,
    });
  }
}