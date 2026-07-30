import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';
import { CategoryId } from '../entities';

export class CategoryNotFound extends DomainError {
  constructor(id?: CategoryId) {
    super({
      key: 'exception.CATEGORY_NOT_FOUND',
      status: HttpStatus.NOT_FOUND,
      details: { id },
    });
  }
}
