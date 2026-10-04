import { AccountId } from 'src/auth';

import { Field, FieldProvider } from '../fields.decorator';

import { ok, Result } from 'neverthrow';

import { DomainError } from '@app/shared';

@Field('user.profile.avatar')
export class UserProfileAvatar implements FieldProvider<
  { accountID: AccountId },
  string
> {
  provide(param: {
    accountID: AccountId;
  }): Promise<Result<string, DomainError>> {
    return Promise.resolve(ok(''));
  }
}