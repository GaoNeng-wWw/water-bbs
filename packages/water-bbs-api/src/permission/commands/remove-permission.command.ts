import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Permission } from 'water-bbs-migration';
import { DomainError, err, ok, Result } from 'water-bbs-shared';

export interface RemovePermissionCommandResponse {
  id: string;
}
export class RemovePermissionCommand extends Command<
  Result<RemovePermissionCommandResponse, DomainError>
> {
  constructor(public readonly code: string) {
    super();
  }
}

@CommandHandler(RemovePermissionCommand)
export class RemovePermissionCommandHandler implements ICommandHandler<RemovePermissionCommand> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
  ) {}
  async execute(
    command: RemovePermissionCommand,
  ): Promise<Result<RemovePermissionCommandResponse, DomainError>> {
    const permission = await this.permissionRepository.findOne({
      code: command.code,
    });
    if (!permission) {
      return err(new DomainError('PERMISSION_NOT_FOUND'));
    }
    permission.remove();
    await this.permissionRepository.upsert(permission);
    return ok({
      id: permission.id,
    });
  }
}
