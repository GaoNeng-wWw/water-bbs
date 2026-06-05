import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Permission } from 'water-bbs-migration';
import { DomainError, ok, Result } from 'water-bbs-shared';

export interface PermissionSummary {
  code: string;
  name: string;
}
export interface ListPermissionResponse {
  permission: PermissionSummary[];
  total: number;
}

export class ListPermission extends Query<
  Result<ListPermissionResponse, DomainError>
> {
  constructor(
    public readonly page: number,
    public readonly size: number,
  ) {
    super();
  }
}

@QueryHandler(ListPermission)
export class ListPermissionHandler implements IQueryHandler<ListPermission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
  ) {}
  async execute(
    query: ListPermission,
  ): Promise<Result<ListPermissionResponse, DomainError>> {
    const [permissions, total] = await this.permissionRepository.findAndCount(
      {},
      {
        offset: (query.page - 1) * query.size,
        limit: query.size,
      },
    );
    return ok({
      permission: permissions,
      total,
    });
  }
}
