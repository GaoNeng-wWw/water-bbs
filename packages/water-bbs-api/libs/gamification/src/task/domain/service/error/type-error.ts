import { DomainError } from '@app/shared';

export class ExpectTypeError extends DomainError {
  constructor(expectType: string, foundType: string) {
    super({
      key: 'exception.EXPECT_TYPE_ERROR',
      args: {
        expectType,
        foundType,
      },
    });
  }
}
