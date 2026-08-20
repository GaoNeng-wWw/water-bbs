import { InfraError } from '@app/shared';

export class StepNotFound extends InfraError {
  constructor(id?: string) {
    super({
      key: 'exception.INTERNAL_ERROR',
      details: { id },
    });
  }
}
