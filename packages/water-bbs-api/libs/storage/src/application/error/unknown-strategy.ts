import { ApplicationError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class UnknownStorageStrategy extends ApplicationError {
  constructor() {
    super({
      key: 'exception.UNKNOWN_STORAGE_STRATEGY',
      status: HttpStatus.BAD_REQUEST
    });
  }
}
