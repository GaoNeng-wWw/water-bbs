import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindPolicyQuery } from './query';
import { PutPolicyCommand, UpdatePolicyCommand } from './commands';
import z from 'zod';
import { Injectable } from '@nestjs/common';
import { PolicyType } from 'water-bbs-shared/policy';

@Injectable()
export class PolicyService {
  constructor(
    private qb: QueryBus,
    private cb: CommandBus,
  ) {}

  getPolicy<P extends PolicyType>(policy: P) {
    return this.qb.execute(new FindPolicyQuery(policy));
  }
  createPolicy<Schema extends z.ZodType>(
    policyId: string,
    schema: Schema,
    defaultValue: z.infer<Schema>,
  ) {
    return this.cb.execute(
      new PutPolicyCommand(policyId, schema, defaultValue),
    );
  }
  updatePolicy<Value>(id: string, value: Value) {
    return this.cb.execute(new UpdatePolicyCommand(id, value));
  }
}
