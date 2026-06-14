import { IAction } from '@app/workflow';
import {
  Command,
  CommandBus,
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';
import { DomainError, ok, Result } from 'water-bbs-shared';
import { hidePostActionSchema, hidePostActionType } from '../actions';
import z from 'zod';
import { CreateProposalCommand } from '../../proposal/command';

export class CreateHidePostProposalCommand extends Command<
  Result<null, DomainError>
> {
  constructor(
    public readonly id: string,
    public readonly reason: string,
    public readonly actor: string,
    public readonly due: Date = new Date(),
  ) {
    super();
  }
}

@CommandHandler(CreateHidePostProposalCommand)
export class CreateHidePostProposalCommandHandler implements ICommandHandler<CreateHidePostProposalCommand> {
  constructor(private readonly cb: CommandBus) {}
  async execute(
    command: CreateHidePostProposalCommand,
  ): Promise<Result<null, DomainError>> {
    const { id, reason } = command;
    const action: IAction<z.infer<typeof hidePostActionSchema>> = {
      type: hidePostActionType,
      args: {
        id,
        reason,
      },
      children: [],
    };
    await this.cb.execute(
      new CreateProposalCommand(
        {
          // TODO: 从 i18n 里获取
          title: '',
          content: reason,
          workflows: [action],
        },
        command.due,
        command.actor,
      ),
    );
    return ok(null);
  }
}
