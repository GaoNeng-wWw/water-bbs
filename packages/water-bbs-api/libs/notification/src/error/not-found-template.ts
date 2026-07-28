import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class NotFoundTemplate extends DomainError {
  constructor(templateName?: string) {
    super({
      key: 'exception.TEMPLATE_NOT_FOUND',
      status: HttpStatus.NOT_FOUND,
      details: { templateName },
    });
  }
}
