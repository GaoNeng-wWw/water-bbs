import { InfraError } from '@app/shared';

export class StepNotFound extends InfraError {
  constructor(stepKey: string) {
    super({
      key: 'exception.INTERNAL_ERROR',
      details: { stepKey },
    });
  }
}
