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

export const UserGovernanceAdminIsSchema = z.object({
  accountID: z.string(),
});

@Field({
  name: 'user.governance.admin.is',
  schema: UserGovernanceAdminIsSchema,
})
export class UserGovernanceAdminIsField implements IFieldProvider<
  typeof UserGovernanceAdminIsSchema,
  boolean
> {
  async execute(
    params: { accountID: AccountId },
    context: FieldProviderContext,
  ): Promise<Result<boolean, InfraError>> {
    const adminGovernanceRecord = await context.em.find(GovernanceMember, {
      accountId: params.accountID,
      kind: MemberKind.Admin,
      endedAt: null,
    });
    if (!adminGovernanceRecord) {
      return ok(false);
    }
    return ok(true);
  }
}
