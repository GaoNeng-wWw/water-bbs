import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { InfraError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { GovernanceMember, MemberKind } from '@app/gamification/governance';
import { AccountId } from 'src/auth';

export const UserGovernanceAdminWasSchema = z.object({
  accountID: z.string(),
});

@Field({
  name: 'user.governance.admin.was',
  schema: UserGovernanceAdminWasSchema,
})
export class UserGovernanceAdminWasField implements IFieldProvider<
  typeof UserGovernanceAdminWasSchema,
  boolean
> {
  async execute(
    params: { accountID: AccountId },
    context: FieldProviderContext,
  ): Promise<Result<boolean, InfraError>> {
    const adminGovernanceRecord = await context.em.find(GovernanceMember, {
      accountId: params.accountID,
      kind: MemberKind.Admin,
      endedAt: { $lt: new Date() },
    });
    if (!adminGovernanceRecord) {
      return ok(false);
    }
    return ok(true);
  }
}
