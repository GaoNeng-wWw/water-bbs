import { DomainError } from '@app/shared';
import { EntityRepository } from '@mikro-orm/sqlite';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { AccountId } from 'src/auth';
import { GovernanceMember } from '../member.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotActiveMember } from '../error';

export type GovernanceMemberInfo = {
  kind: 'admin' | 'bd';
  startedAt: Date;
  endedAt?: Date;
};

export class GetAccountGovernanceMember extends Query<
  Result<GovernanceMemberInfo, DomainError>
> {
  constructor(public readonly accountId: AccountId) {
    super();
  }
}

@QueryHandler(GetAccountGovernanceMember)
export class GetAccountGovernanceMemberService implements IQueryHandler<GetAccountGovernanceMember> {
  constructor(
    @InjectRepository(GovernanceMember)
    private readonly repo: EntityRepository<GovernanceMember>,
  ) {}
  async execute({
    accountId,
  }: GetAccountGovernanceMember): Promise<
    Result<GovernanceMemberInfo, DomainError>
  > {
    const memberRecord = await this.repo.findOne({ accountId });
    if (!memberRecord) {
      return err(new NotActiveMember());
    }
    return ok({
      startedAt: memberRecord.startedAt,
      endedAt: memberRecord.endedAt,
      kind: memberRecord.kind,
    });
  }
}
