import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
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
  UpdateProfileDTO,
  UpdateProfileResponse,
} from '../../domain/dto/update-profile.dto';

export class UpdateProfileCommand extends Command<
  Result<UpdateProfileResponse, DomainError>
> {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateProfileDTO,
  ) {
    super();
  }
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileCommandHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @InjectAccountRepository()
    private accountRepository: IAccountRepoistory,
  ) {}

  async execute(
    command: UpdateProfileCommand,
  ): Promise<Result<UpdateProfileResponse, DomainError>> {
    const accountId = new AccountID({ value: command.id });
    const res = await this.accountRepository.findOne(accountId);
    if (isErr(res)) {
      return err(unwrapErr(res));
    }
    const account = res.value;
    if (!account) {
      return err(new AccountNotFound());
    }
    if (command.dto.username) {
      account.profile.name = command.dto.username;
    }
    if (command.dto.bio) {
      account.profile.bio = command.dto.bio;
    }
    const updateResult = await this.accountRepository.upsert(account);
    if (isErr(updateResult)) {
      return updateResult;
    }
    return ok(
      new UpdateProfileResponse(
        account.id,
        account.profile.name,
        account.profile.bio,
      ),
    );
  }
}
