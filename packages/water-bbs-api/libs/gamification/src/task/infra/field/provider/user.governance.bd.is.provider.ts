import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { InfraError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { GovernanceMember, MemberKind } from '@app/gamification/governance';

export const UserGovernanceBDIsSchema = z.object({});

@Field({
  name: 'user.governance.bd.is',
  schema: UserGovernanceBDIsSchema,
})
export class UserGovernanceBDIsField implements IFieldProvider<
  typeof UserGovernanceBDIsSchema,
  boolean
> {
  async execute(
    _params: z.infer<typeof UserGovernanceBDIsSchema>,
    context: FieldProviderContext,
  ): Promise<Result<boolean, InfraError>> {
    const bdGovernanceRecord = await context.em.find(GovernanceMember, {
      accountId: context.accountID,
      kind: MemberKind.BD,
      endedAt: { $gt: new Date() },
    });
    if (!bdGovernanceRecord) {
      return ok(false);
    }
    return ok(true);
  }
}