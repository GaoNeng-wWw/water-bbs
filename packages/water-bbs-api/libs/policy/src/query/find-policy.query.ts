import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CommandHandler, IQueryHandler, Query } from '@nestjs/cqrs';
import { isEmpty } from 'radashi';
import { Policy } from 'water-bbs-migration';
import { DomainError, err, ok, PolicyType, Result } from 'water-bbs-shared';
import z from 'zod';

export type InferValueFromPolicy<P extends PolicyType> =
  P['schema'] extends z.ZodType ? z.infer<P['schema']> : unknown;

export type FindPolicyResponse<P extends PolicyType> = {
  id: string;
  value: InferValueFromPolicy<P>;
};

export class FindPolicyQuery<P extends PolicyType> extends Query<
  Result<FindPolicyResponse<P>, DomainError>
> {
  constructor(public readonly policy: P) {
    super();
  }
}

@CommandHandler(FindPolicyQuery)
export class FindPolicy<P extends PolicyType> implements IQueryHandler<
  FindPolicyQuery<P>
> {
  async execute({
    policy: { id },
  }: FindPolicyQuery<P>): Promise<Result<FindPolicyResponse<P>, DomainError>> {
    const policy = await this.repo.findOne({
      id,
    });
    if (isEmpty(policy) || !policy) {
      return err(new DomainError('POLICY_NOT_FOUND', null, { id }));
    }
    const value = policy.value as InferValueFromPolicy<P>;
    return ok({ id, value });
  }
  constructor(
    @InjectRepository(Policy)
    private readonly repo: EntityRepository<Policy<unknown>>,
  ) {}
}
