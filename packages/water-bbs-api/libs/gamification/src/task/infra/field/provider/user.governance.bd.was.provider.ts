import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { InfraError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { GovernanceMember, MemberKind } from '@app/gamification/governance';

export const UserGovernanceBDWasSchema = z.object({});

@Field({
  name: 'user.governance.bd.was',
  schema: UserGovernanceBDWasSchema,
})
export class UserGovernanceBDWasField implements IFieldProvider<
  typeof UserGovernanceBDWasSchema,
  boolean
> {
  async execute(
    _params: z.infer<typeof UserGovernanceBDWasSchema>,
    context: FieldProviderContext,
  ): Promise<Result<boolean, InfraError>> {
    const bdGovernanceRecord = await context.em.find(GovernanceMember, {
      accountId: context.accountID,
      kind: MemberKind.BD,
      endedAt: { $lt: new Date() },
    });
    if (!bdGovernanceRecord) {
      return ok(false);
    }
    return ok(true);
  }
}