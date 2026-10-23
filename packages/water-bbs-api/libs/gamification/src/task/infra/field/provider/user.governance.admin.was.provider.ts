import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { InfraError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { GovernanceMember, MemberKind } from '@app/gamification/governance';

export const UserGovernanceAdminWasSchema = z.object({});

@Field({
  name: 'user.governance.admin.was',
  schema: UserGovernanceAdminWasSchema,
})
export class UserGovernanceAdminWasField implements IFieldProvider<
  typeof UserGovernanceAdminWasSchema,
  boolean
> {
  async execute(
    _params: z.infer<typeof UserGovernanceAdminWasSchema>,
    context: FieldProviderContext,
  ): Promise<Result<boolean, InfraError>> {
    const adminGovernanceRecord = await context.em.find(GovernanceMember, {
      accountId: context.accountID,
      kind: MemberKind.Admin,
      endedAt: { $lt: new Date() },
    });
    if (!adminGovernanceRecord) {
      return ok(false);
    }
    return ok(true);
  }
}