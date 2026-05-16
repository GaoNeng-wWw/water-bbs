import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountRemovedCommand } from '../../../account/domain/command';
import { PersistenceError, Result } from 'water-bbs-shared';
import { InjectSessionRepo, type ISessionRepo } from '../session.repo';

@CommandHandler(AccountRemovedCommand)
export class OnAccountRemovedHandler implements ICommandHandler<
  AccountRemovedCommand,
  Result<boolean, PersistenceError>
> {
  constructor(
    @InjectSessionRepo()
    private readonly authRepository: ISessionRepo
  ) {}
  async execute(command: AccountRemovedCommand) {
    return this.authRepository.removeAllToken(command.accountId);
  }
}
