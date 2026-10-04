import { AccountId } from 'src/auth';
import { Field, FieldProvider } from '../fields.decorator';
import { ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { GovernanceMember } from '../../../governance/member/member.entity';

@Field('user.governance.member.list')
export class UserGovernanceMemberList implements FieldProvider<
  { accountID: AccountId },
  GovernanceMember[]
> {
  constructor(
    @InjectRepository(GovernanceMember)
    private readonly repo: EntityRepository<GovernanceMember>,
  ) {}

  async provide(param: {
    accountID: AccountId;
  }): Promise<Result<GovernanceMember[], DomainError>> {
    const records = await this.repo.find({ accountId: param.accountID });

    return ok(records);
  }
}