import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountResetPasswordCommand } from '../../../account/domain/command';
import { PersistenceError, Result } from 'water-bbs-shared';
import { InjectSessionRepo, type ISessionRepo } from '../session.repo';

@CommandHandler(AccountResetPasswordCommand)
export class OnAccountResetPasswordHandler implements ICommandHandler<
  AccountResetPasswordCommand,
  Result<boolean, PersistenceError>
> {
  constructor(
    @InjectSessionRepo()
    private readonly authRepository: ISessionRepo,
  ) {}
  async execute(command: AccountResetPasswordCommand) {
    return this.authRepository.removeAllToken(command.accountId);
  }
}
