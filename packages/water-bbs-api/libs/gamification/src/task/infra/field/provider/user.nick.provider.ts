import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { Profile } from 'src/auth';
import { ok, Result } from 'neverthrow';
import { InfraError } from '@app/shared';

export const UserNickFieldSchema = z.object({});

@Field({ name: 'user.nick', schema: UserNickFieldSchema })
export class UserNickField implements IFieldProvider<
  typeof UserNickFieldSchema,
  string
> {
  async execute(
    _params: z.infer<typeof UserNickFieldSchema>,
    context: FieldProviderContext,
  ): Promise<Result<string | null, InfraError>> {
    const profile = await context.em.findOne(Profile, {
      accountId: context.accountID,
    });
    if (!profile) {
      return ok(null);
    }
    return ok(profile.nick);
  }
}