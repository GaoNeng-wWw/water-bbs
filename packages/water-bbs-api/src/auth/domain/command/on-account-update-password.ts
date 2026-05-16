import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountUpdatedPasswordCommand } from '../../../account/domain/command';
import { PersistenceError, Result } from 'water-bbs-shared';
import { InjectSessionRepo, type ISessionRepo } from '../session.repo';

@CommandHandler(AccountUpdatedPasswordCommand)
export class OnAccountUpdatedPasswordHandler implements ICommandHandler<
  AccountUpdatedPasswordCommand,
  Result<boolean, PersistenceError>
> {
  constructor(
    @InjectSessionRepo()
    private readonly authRepository: ISessionRepo,
  ) {}
  async execute(command: AccountUpdatedPasswordCommand) {
    return this.authRepository.removeAllToken(command.accountId);
  }
}
