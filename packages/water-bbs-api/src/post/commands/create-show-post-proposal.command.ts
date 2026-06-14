import { IAction } from '@app/workflow';
import {
  Command,
  CommandBus,
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';
import { DomainError, ok, Result } from 'water-bbs-shared';
import { showPostActionName, ShowPostActionSchema } from '../actions';
import { CreateProposalCommand } from '../../proposal/command';

export class CreateShowPostProposalCommand extends Command<
  Result<null, DomainError>
> {
  constructor(
    public readonly id: string,
    public readonly actor: string,
    public readonly due: Date = new Date(),
  ) {
    super();
  }
}

@CommandHandler(CreateShowPostProposalCommand)
export class CreateShowPostProposalCommandHandler implements ICommandHandler<CreateShowPostProposalCommand> {
  constructor(private readonly cb: CommandBus) {}
  async execute(
    command: CreateShowPostProposalCommand,
  ): Promise<Result<null, DomainError>> {
    const { id } = command;
    const action: IAction<ShowPostActionSchema> = {
      type: showPostActionName,
      args: {
        id,
      },
      children: [],
    };
    await this.cb.execute(
      new CreateProposalCommand(
        {
          // TODO: 从 i18n 里获取
          title: '',
          content: '',
          workflows: [action],
        },
        command.due,
        command.actor,
      ),
    );
    return ok(null);
  }
}
