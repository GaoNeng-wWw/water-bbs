import { DomainError } from '@app/shared';
import { HttpStatus } from '@nestjs/common';

export class WalletNotFound extends DomainError {
  constructor(cause?: Error) {
    super({
      key: 'exception.WALLET_NOT_FOUND',
      cause,
      status: HttpStatus.NOT_FOUND,
    });
  }
}
