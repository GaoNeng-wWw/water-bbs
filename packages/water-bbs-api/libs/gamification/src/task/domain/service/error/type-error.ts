import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class ExpectTypeError extends DomainError {
  constructor(expectType: string, foundType: string) {
    super({
      key: 'exception.EXPECT_TYPE_ERROR',
      args: {
        expectType,
        foundType,
      },
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
