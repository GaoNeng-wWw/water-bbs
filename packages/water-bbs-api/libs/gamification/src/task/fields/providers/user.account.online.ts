import { AccountId, Online } from 'src/auth';
import { Field, FieldProvider } from '../fields.decorator';
import { Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { QueryBus } from '@nestjs/cqrs';

@Field('user.account.online')
export class UserAccountOnline implements FieldProvider<
  { accountID: AccountId },
  boolean
> {
  constructor(private readonly qb: QueryBus) {}

  async provide(param: {
    accountID: AccountId;
  }): Promise<Result<boolean, DomainError>> {
    return this.qb.execute(new Online(param.accountID));
  }
}