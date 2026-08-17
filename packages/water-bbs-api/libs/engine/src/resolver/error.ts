import { InfraError } from '@app/shared';

export class ResolverNotFound extends InfraError {
  constructor(name: string) {
    super({
      // Resolver Not Found
      key: 'exception.INTERNAL_ERROR',
      details: { name },
    });
  }
}


export class BadValid extends InfraError {
  constructor(message: string) {
    super({
      // Bad Valid
      key: 'exception.INTERNAL_ERROR',
      details: { message },
    });
  }
}