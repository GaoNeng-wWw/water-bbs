import z from 'zod';
import {
  Field,
  FieldProviderContext,
  IFieldProvider,
} from '../field.decorator';
import { InfraError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { AccountId } from 'src/auth';

export const UserIDFieldSchema = z.object({});

@Field({ name: 'user.id', schema: UserIDFieldSchema })
export class UserIDField implements IFieldProvider<
  typeof UserIDFieldSchema,
  AccountId
> {
  execute(
    _params: z.infer<typeof UserIDFieldSchema>,
    context: FieldProviderContext,
  ): Promise<Result<AccountId | null, InfraError>> {
    return Promise.resolve(ok(context.accountID));
  }
}