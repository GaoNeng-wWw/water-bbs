import { DomainError } from '@app/shared';
import { EntityRepository } from '@mikro-orm/sqlite';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';
import { GovernanceMember } from '../member.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AccountId } from 'src/auth';
import { GovernanceMemberInfo } from './get-account-governance-member.query';

export type GovernanceMemberList = {
  items: GovernanceMemberInfo[];
  nextCursor: string | null;
};

export class GetAccountGovernanceMemberList extends Query<
  Result<GovernanceMemberList, DomainError>
> {
  constructor(
    public readonly accountId: AccountId,
    public readonly nextCursor?: string,
    public readonly size: number = 10,
  ) {
    super();
  }
}

@QueryHandler(GetAccountGovernanceMemberList)
export class GetAccountGovernanceMemberListService implements IQueryHandler<GetAccountGovernanceMemberList> {
  constructor(
    @InjectRepository(GovernanceMember)
    private readonly repo: EntityRepository<GovernanceMember>,
  ) {}
  async execute({
    accountId,
    nextCursor,
    size,
  }: GetAccountGovernanceMemberList): Promise<
    Result<GovernanceMemberList, DomainError>
  > {
    const res = await this.repo.findByCursor({
      first: size,
      after: nextCursor,
      where: {
        accountId,
      },
    });
    return ok({
      items: res.items,
      nextCursor: res.endCursor,
    });
  }
}
