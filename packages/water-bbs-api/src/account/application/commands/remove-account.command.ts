import {
  Command,
  CommandBus,
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';
import {
  DomainError,
  err,
  isErr,
  ok,
  Result,
  unwrapErr,
} from 'water-bbs-shared';
import { AccountID } from '../../domain';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../../domain/repo/account.repo';
import { AccountNotFound } from '../errors/account-not-found';
import {
  RemoveAccountDTO,
  RemoveAccountResponse,
} from '../../domain/dto/remove-account.dto';
import { AccountRemovedCommand } from '../../domain/command';

export class RemoveAccountCommand extends Command<
  Result<RemoveAccountResponse, DomainError>
> {
  constructor(public readonly dto: RemoveAccountDTO) {
    super();
  }
}

@CommandHandler(RemoveAccountCommand)
export class RemoveAccountCommandHandler implements ICommandHandler<RemoveAccountCommand> {
  constructor(
    @InjectAccountRepository()
    private accountRepository: IAccountRepoistory,
    private readonly commandPublisher: CommandBus,
  ) {}

  async execute(
    command: RemoveAccountCommand,
  ): Promise<Result<RemoveAccountResponse, DomainError>> {
    const accountId = new AccountID({ value: command.dto.id });
    const res = await this.accountRepository.findOne(accountId);
    if (isErr(res)) {
      return err(unwrapErr(res));
    }
    const account = res.value;
    if (!account) {
      return err(new AccountNotFound());
    }
    const removeHandle = account.remove();
    if (isErr(removeHandle)) {
      return removeHandle;
    }
    const updateResult = await this.accountRepository.upsert(account);
    if (isErr(updateResult)) {
      return updateResult;
    }
    const decrHandle = await this.accountRepository.decr();
    if (isErr(decrHandle)) {
      return err(decrHandle.error);
    }
    await this.commandPublisher.execute(
      new AccountRemovedCommand(accountId.get('value')),
    );
    return ok(new RemoveAccountResponse(account.id));
  }
}
