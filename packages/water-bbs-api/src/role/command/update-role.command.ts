import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Command, ICommandHandler } from '@nestjs/cqrs';
import { Permission, Role } from 'water-bbs-migration';
import { DomainError, err, ok, Result } from 'water-bbs-shared';

export class UpdateRoleCommand extends Command<
  Result<{ id: string }, DomainError>
> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly permissionCodes?: string[],
  ) {
    super();
  }
}

export class UpdateRoleCommandHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
  ) {}
  async execute(
    command: UpdateRoleCommand,
  ): Promise<Result<{ id: string }, DomainError>> {
    const role = await this.roleRepository.findOne({
      id: command.id,
    });
    if (!role) {
      return err(new DomainError('ROLE_NOT_FOUND'));
    }
    role.name = command.name;
    if (!command.permissionCodes) {
      await this.roleRepository.upsert(role);
      return ok({ id: role.id });
    }
    const permissions: Permission[] = [];
    for (const p of command.permissionCodes) {
      const permission = await this.permissionRepository.findOne({
        code: p,
      });
      if (!permission) {
        return err(new DomainError('PERMISSION_NOT_FOUND'));
      }
      permissions.push(permission);
    }
    role.setPermission(permissions);
    await this.roleRepository.upsert(role);
    return ok({ id: role.id });
  }
}
