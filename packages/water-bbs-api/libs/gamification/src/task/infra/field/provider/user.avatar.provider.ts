import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { ok, Result } from 'neverthrow';
import { InfraError } from '@app/shared';

export const UserAvatarFieldSchema = z.object({});

@Field({ name: 'user.avatar', schema: UserAvatarFieldSchema })
export class UserAvatarField implements IFieldProvider<
  typeof UserAvatarFieldSchema,
  string
> {
  async execute(
    _params: z.infer<typeof UserAvatarFieldSchema>,
    _context: FieldProviderContext,
  ): Promise<Result<string | null, InfraError>> {
    return ok('');
  }
}