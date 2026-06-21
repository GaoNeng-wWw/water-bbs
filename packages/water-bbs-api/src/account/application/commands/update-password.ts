import {
  Command,
  CommandBus,
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../../domain/repo/account.repo';
import { DomainError, err, isErr, ok, Result } from 'water-bbs-shared';
import { AccountID } from '../../domain';
import { AccountNotFound } from '../errors';
import { CaptchaService } from '@app/captcha/captcha.service';
import { Channel } from '@app/captcha/domain';
import { InvalidMfa } from '../errors/invalid-mfa';
import { AccountUpdatedPasswordCommand } from '../../domain/command';

type UpdatePasswordOptions = {
  accountID: string;
  password: string;
  mfaCode: string;
};

export class UpdatePasswordCommand extends Command<
  Result<boolean, DomainError>
> {
  constructor(public opts: UpdatePasswordOptions) {
    super();
  }
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordCommandHandler implements ICommandHandler<UpdatePasswordCommand> {
  constructor(
    @InjectAccountRepository()
    private accountRepository: IAccountRepoistory,
    private captcha: CaptchaService,
    private readonly commandPublisher: CommandBus,
  ) {}
  async execute(
    dto: UpdatePasswordCommand,
  ): Promise<Result<boolean, DomainError>> {
    const accountRes = await this.accountRepository.findOne(
      new AccountID({ value: dto.opts.accountID }),
    );
    if (isErr(accountRes)) {
      return accountRes;
    }
    const account = accountRes.value;
    if (!account) {
      return err(new AccountNotFound());
    }

    const mfaResult = await this.captcha.verify(
      dto.opts.mfaCode,
      account.id,
      Channel.Email,
    );
    if (isErr(mfaResult)) {
      return mfaResult;
    }
    const mfaStatus = mfaResult.value;
    if (!mfaStatus) {
      return err(new InvalidMfa());
    }

    const resetPasswordRes = account.resetPassword(dto.opts.password);
    if (isErr(resetPasswordRes)) {
      return resetPasswordRes;
    }
    const updateResult = await this.accountRepository.upsert(account);
    if (isErr(updateResult)) {
      return updateResult;
    }
    await this.commandPublisher.execute(
      new AccountUpdatedPasswordCommand(account.id),
    );
    return ok(true);
  }
}
