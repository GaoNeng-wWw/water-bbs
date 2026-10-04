import { AccountId } from 'src/auth';
import { Field, FieldProvider } from '../fields.decorator';
import { ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { EntityManager } from '@mikro-orm/sqlite';

@Field('user.account.banned')
export class UserAccountBanned implements FieldProvider<
  { accountID: AccountId },
  boolean
> {
  constructor(private readonly em: EntityManager) {}
  provide(param: {
    accountID: AccountId;
  }): Promise<Result<boolean, DomainError>> {
    // todo: wip

    return Promise.resolve(ok(true));
  }
}