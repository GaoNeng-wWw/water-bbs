import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { isEmpty } from 'radashi';
import { Action } from 'water-bbs-migration';
import { DomainError, err, ok, Result } from 'water-bbs-shared';
import { UpdateActiveResponse } from '../dto/update-active.dto';

export class UpdateActiveCommand extends Command<
  Result<UpdateActiveResponse, DomainError>
> {
  constructor(
    public id: string,
    public active: boolean,
  ) {
    super();
  }
}

@CommandHandler(UpdateActiveCommand)
export class UpdateActiveCommandHandler implements ICommandHandler<UpdateActiveCommand> {
  constructor(
    @InjectRepository(Action)
    private readonly repo: EntityRepository<Action>,
  ) {}
  async execute(
    command: UpdateActiveCommand,
  ): Promise<Result<UpdateActiveResponse, DomainError>> {
    const action = await this.repo.findOne({ id: command.id });
    if (!action || isEmpty(action)) {
      return err(new DomainError('action not found'));
    }
    if (command.active) {
      action.enable();
    } else {
      action.disable();
    }
    await this.repo.upsert(action);
    return ok({ id: action.id });
  }
}
