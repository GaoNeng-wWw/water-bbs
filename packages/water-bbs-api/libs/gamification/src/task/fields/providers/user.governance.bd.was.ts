import { AccountId } from 'src/auth';
import { Field, FieldProvider } from '../fields.decorator';
import { ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import {
  GovernanceMember,
  MemberKind,
} from '../../../governance/member/member.entity';

@Field('user.governance.bd.was')
export class UserGovernanceBdWas implements FieldProvider<
  { accountID: AccountId },
  boolean
> {
  constructor(
    @InjectRepository(GovernanceMember)
    private readonly repo: EntityRepository<GovernanceMember>,
  ) {}

  async provide(param: {
    accountID: AccountId;
  }): Promise<Result<boolean, DomainError>> {
    const records = await this.repo.findOne({
      accountId: param.accountID,
      kind: MemberKind.BD,
      endedAt: {
        $lte: new Date(),
      },
    });

    return ok(records !== null);
  }
}