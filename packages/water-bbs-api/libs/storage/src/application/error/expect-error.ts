import { ApplicationError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class ExpectTypeError extends ApplicationError {
  constructor(expectationType: string, found: string) {
    super({
      key: 'exception.EXPECT_TYPE_ERROR',
      args: {
        expectationType,
        found,
      },
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
