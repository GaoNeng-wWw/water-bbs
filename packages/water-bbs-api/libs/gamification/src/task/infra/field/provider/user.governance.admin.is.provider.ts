import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { InfraError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { GovernanceMember, MemberKind } from '@app/gamification/governance';

export const UserGovernanceAdminIsSchema = z.object({});

@Field({
  name: 'user.governance.admin.is',
  schema: UserGovernanceAdminIsSchema,
})
export class UserGovernanceAdminIsField implements IFieldProvider<
  typeof UserGovernanceAdminIsSchema,
  boolean
> {
  async execute(
    _params: z.infer<typeof UserGovernanceAdminIsSchema>,
    context: FieldProviderContext,
  ): Promise<Result<boolean, InfraError>> {
    const adminGovernanceRecord = await context.em.find(GovernanceMember, {
      accountId: context.accountID,
      kind: MemberKind.Admin,
      endedAt: null,
    });
    if (!adminGovernanceRecord) {
      return ok(false);
    }
    return ok(true);
  }
}