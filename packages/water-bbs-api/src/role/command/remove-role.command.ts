import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Role } from 'water-bbs-migration';
import { DomainError, err, Result, ok } from 'water-bbs-shared';

export class RemoveRoleCommand extends Command<
  Result<{ id: string }, DomainError>
> {
  constructor(public readonly id: string) {
    super();
  }
}

@CommandHandler(RemoveRoleCommand)
export class RemoveRoleCommandHandler implements ICommandHandler<RemoveRoleCommand> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
  ) {}
  async execute(
    command: RemoveRoleCommand,
  ): Promise<Result<{ id: string }, DomainError>> {
    const role = await this.roleRepository.findOne({
      id: command.id,
    });
    if (!role) {
      return err(new DomainError('ROLE_NOT_FOUND'));
    }
    role.remove();
    await this.roleRepository.upsert(role);
    return ok({ id: role.id });
  }
}
