import { ApplicationServiceError } from 'water-bbs-shared';

export class PolicyError extends ApplicationServiceError {
  constructor(
    public child: Error | null = null,
    public args: Record<string, any> = {},
  ) {
    super('POLICY_ERROR', 400, child, args);
  }
}
