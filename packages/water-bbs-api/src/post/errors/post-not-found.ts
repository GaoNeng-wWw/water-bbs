import { HttpStatus } from '@nestjs/common';
import { ApplicationServiceError } from 'water-bbs-shared';

export class PostNotFound extends ApplicationServiceError {
  constructor() {
    super('POST_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
