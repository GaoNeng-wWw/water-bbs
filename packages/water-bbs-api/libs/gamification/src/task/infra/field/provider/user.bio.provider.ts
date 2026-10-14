import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { AccountId, Profile } from 'src/auth';
import { ok, Result } from 'neverthrow';
import { InfraError } from '@app/shared';

export const UserBioFieldSchema = z.object({
  accountID: z.string(),
});

@Field({ name: 'user.bio', schema: UserBioFieldSchema })
export class UserBioField implements IFieldProvider<
  typeof UserBioFieldSchema,
  string | null
> {
  async execute(
    params: { accountID: AccountId },
    context: FieldProviderContext,
  ): Promise<Result<string | null, InfraError>> {
    const profile = await context.em.findOne(Profile, {
      accountId: params.accountID,
    });
    if (!profile) {
      return ok(null);
    }
    return ok(profile.bio ?? null);
  }
}