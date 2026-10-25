import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class SchemaTypeError extends DomainError {
  constructor(expectationType: string, foundType: string) {
    super({
      key: 'exception.EXPECT_TYPE_ERROR',
      args: {
        expectationType,
        foundType,
      },
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
