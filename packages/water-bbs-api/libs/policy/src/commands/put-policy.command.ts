import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { isEmpty } from 'radashi';
import { Policy } from 'water-bbs-migration';
import {
  DomainError,
  err,
  ok,
  PersistenceError,
  Result,
} from 'water-bbs-shared';
import z from 'zod';

export class PutPolicyCommand<Schema extends z.ZodType> extends Command<
  Result<string, DomainError>
> {
  constructor(
    public readonly policyId: string,
    public readonly schema: Schema,
    public readonly defaultValue: z.infer<Schema>,
  ) {
    super();
  }
}

@CommandHandler(PutPolicyCommand)
export class PutPolicy<Schema extends z.ZodType> implements ICommandHandler<
  PutPolicyCommand<Schema>
> {
  async execute(
    command: PutPolicyCommand<Schema>,
  ): Promise<Result<string, DomainError>> {
    const { policyId, schema, defaultValue } = command;
    const dbPolicy = await this.repo.findOne(
      {
        id: policyId,
      },
      { cache: true },
    );
    if (!isEmpty(dbPolicy)) {
      return err(new DomainError('POLICY_EXISTS', null, { policyId }));
    }
    const policy = new Policy<z.infer<Schema>>(
      policyId,
      z.toJSONSchema(schema),
      defaultValue,
    );
    return this.repo
      .upsert(policy)
      .then(() => ok(policyId))
      .catch((reason) => {
        const p = new PersistenceError(reason);
        return err(new DomainError(p.message, p));
      });
  }
  constructor(
    @InjectRepository(Policy)
    private readonly repo: EntityRepository<Policy<unknown>>,
  ) {}
}
