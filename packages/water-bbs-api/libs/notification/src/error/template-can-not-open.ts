import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class TemplateCanNotOpen extends DomainError {
  constructor() {
    super({
      key: 'exception.TEMPLATE_CAN_NOT_OPEN',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
