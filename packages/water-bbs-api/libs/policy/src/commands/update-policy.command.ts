import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { isEmpty } from 'radashi';
import { Policy } from 'water-bbs-migration';
import { DomainError, err, ok, Result } from 'water-bbs-shared';
import z from 'zod';

export type InferValueFromPolicy<P extends Policy<unknown>> =
  P extends Policy<infer Value> ? Value : never;

export type UpdatePolicyResponse<ValueType> = {
  id: string;
  value: ValueType;
};

export class UpdatePolicyCommand<ValueType> extends Command<
  Result<UpdatePolicyResponse<ValueType>, DomainError>
> {
  constructor(
    public readonly id: string,
    public readonly value: ValueType,
  ) {
    super();
  }
}

@CommandHandler(UpdatePolicyCommand)
export class UpdatePolicy<ValueType> implements ICommandHandler<
  UpdatePolicyCommand<ValueType>
> {
  async execute({
    id,
    value,
  }: UpdatePolicyCommand<ValueType>): Promise<
    Result<UpdatePolicyResponse<ValueType>, DomainError>
  > {
    const policy = await this.repo.findOne({ id });
    if (!policy || isEmpty(policy)) {
      return err(new DomainError('POLICY_NOT_FOUND', null, { id }));
    }
    const schema = z.fromJSONSchema(policy.schema);
    const { success, error } = schema.safeParse(value);
    if (!success) {
      return err(new DomainError('PARSE_POLICY_FAIL', error, { id }));
    }
    policy.value = value;
    await this.repo.upsert(policy);

    return ok({ id, value });
  }
  constructor(
    @InjectRepository(Policy)
    private readonly repo: EntityRepository<Policy<unknown>>,
  ) {}
}
