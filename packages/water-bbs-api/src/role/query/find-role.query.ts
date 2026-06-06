import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query } from '@nestjs/cqrs';
import { Role } from 'water-bbs-migration';
import { DomainError, err, ok, Result } from 'water-bbs-shared';

export type RolePermissionInfo = {
  code: string;
  name: string;
};
export type RoleInfo = {
  code: string;
  name: string;
  permissions: RolePermissionInfo[];
};

export class FindRoleQuery extends Query<Result<RoleInfo, DomainError>> {
  constructor(public readonly code: string) {
    super();
  }
}

export class FindRoleHandler implements IQueryHandler<FindRoleQuery> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
  ) {}

  async execute(query: FindRoleQuery): Promise<Result<RoleInfo, DomainError>> {
    const role = await this.roleRepository.findOne({
      code: query.code,
    });
    if (!role) {
      return err(new DomainError('ROLE_NOT_FOUND'));
    }
    return ok({
      code: role.code,
      name: role.name,
      permissions: role.permissions.map((p) => ({
        code: p.code,
        name: p.name,
      })),
    });
  }
}
