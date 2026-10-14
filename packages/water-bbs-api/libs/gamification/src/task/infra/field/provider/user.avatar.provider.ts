import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { AccountId } from 'src/auth';
import { ok, Result } from 'neverthrow';
import { InfraError } from '@app/shared';

export const UserAvatarFieldSchema = z.object({
  accountID: z.string(),
});

@Field({ name: 'user.avatar', schema: UserAvatarFieldSchema })
export class UserAvatarField implements IFieldProvider<
  typeof UserAvatarFieldSchema,
  string
> {
  async execute(
    params: { accountID: AccountId },
    _context: FieldProviderContext,
  ): Promise<Result<string | null, InfraError>> {
    return ok('');
  }
}