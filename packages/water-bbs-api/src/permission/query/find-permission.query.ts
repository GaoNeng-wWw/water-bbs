import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Permission } from 'water-bbs-migration';
import { DomainError, Result, ok, err } from 'water-bbs-shared';

export interface FindPermissionResponse {
  id: string;
  code: string;
  name: string;
}

export class FindPermission extends Query<
  Result<FindPermissionResponse, DomainError>
> {
  constructor(public readonly code: string) {
    super();
  }
}

@QueryHandler(FindPermission)
export class FindPermissionHandler implements IQueryHandler<FindPermission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
  ) {}

  async execute(
    query: FindPermission,
  ): Promise<Result<FindPermissionResponse, DomainError>> {
    const permission = await this.permissionRepository.findOne({
      code: query.code,
    });
    if (!permission) {
      return err(new DomainError('PERMISSION_NOT_FOUND'));
    }
    return ok({
      id: permission.id,
      code: permission.code,
      name: permission.name,
    });
  }
}
