import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class SchemaParseError extends DomainError {
  constructor() {
    super({
      key: 'exception.SCHEMA_PARSE_ERROR',
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
