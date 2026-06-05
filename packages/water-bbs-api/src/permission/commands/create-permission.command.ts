import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Permission } from 'water-bbs-migration';
import { DomainError, ok, Result } from 'water-bbs-shared';

export interface CreatePermissionCommandResponse {
  id: string;
  code: string;
  name: string;
}

export class CreatePermissionCommand extends Command<
  Result<CreatePermissionCommandResponse, DomainError>
> {
  constructor(
    public readonly code: string,
    public readonly name: string,
  ) {
    super();
  }
}

@CommandHandler(CreatePermissionCommand)
export class CreatePermissionCommandHandler implements ICommandHandler<CreatePermissionCommand> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
  ) {}
  async execute(
    command: CreatePermissionCommand,
  ): Promise<Result<CreatePermissionCommandResponse, DomainError>> {
    const permission = Permission.create(command.code, command.name);
    await this.permissionRepository.upsert(permission);
    return ok({
      id: permission.id,
      code: permission.code,
      name: permission.name,
    });
  }
}
