import z from 'zod';
import { Field, IFieldProvider } from '../field.decorator';
import { InfraError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { AccountId } from 'src/auth';

export const UserIDFieldSchema = z.object({
  accountID: z.string(),
});

@Field({ name: 'user.id', schema: UserIDFieldSchema })
export class UserIDField implements IFieldProvider<
  typeof UserIDFieldSchema,
  AccountId
> {
  execute(params: {
    accountID: AccountId;
  }): Promise<Result<AccountId | null, InfraError>> {
    return Promise.resolve(ok(params.accountID));
  }
}
