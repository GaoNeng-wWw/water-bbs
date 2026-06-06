import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Permission, Role } from 'water-bbs-migration';
import { DomainError, ok, Result } from 'water-bbs-shared';

export type RoleInfo = {
  code: string;
  name: string;
  permissions: { code: string; name: string }[];
};

export class CreateRoleCommand extends Command<Result<RoleInfo, DomainError>> {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly permissionCodes: string[],
  ) {
    super();
  }
}

@CommandHandler(CreateRoleCommand)
export class CreateRoleCommandHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
  ) {}
  async execute(
    command: CreateRoleCommand,
  ): Promise<Result<RoleInfo, DomainError>> {
    const permissions = await this.permissionRepository.find({
      code: {
        $in: command.permissionCodes,
      },
    });
    const role = Role.create(command.code, command.name, permissions);
    await this.roleRepository.upsert(role);
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
