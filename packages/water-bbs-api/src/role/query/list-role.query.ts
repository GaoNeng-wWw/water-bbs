import { Pagination } from '@app/shared';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query } from '@nestjs/cqrs';
import { Role } from 'water-bbs-migration';
import { DomainError, ok, Result } from 'water-bbs-shared';

export type RoleSummary = {
  name: string;
  code: string;
};

export class ListRoleQuery extends Query<
  Result<Pagination<RoleSummary>, DomainError>
> {
  constructor(
    public readonly page: number = 1,
    public readonly size: number = 10,
  ) {
    super();
  }
}

export class ListRoleHandler implements IQueryHandler<ListRoleQuery> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
  ) {}
  async execute(
    query: ListRoleQuery,
  ): Promise<Result<Pagination<RoleSummary>, DomainError>> {
    const [roles, total] = await this.roleRepository.findAndCount(
      {},
      {
        offset: (query.page - 1) * query.size,
        limit: query.size,
      },
    );
    return ok(new Pagination(total, roles));
  }
}
