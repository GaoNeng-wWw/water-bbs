import {
  Command,
  CommandBus,
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';
import { DomainError, err, isErr, ok, Result } from 'water-bbs-shared';
import { ResetPasswordDTO } from '../../domain/dto/reset-password.dto';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../../domain/repo/account.repo';
import { CaptchaService } from '@app/captcha/captcha.service';
import { IdentEnum } from 'water-bbs-migration';
import { AccountNotFound } from '../errors';
import { Channel } from '@app/captcha/domain';
import { InvalidMfa } from '../errors/invalid-mfa';
import { AccountResetPasswordCommand } from '../../domain/command';

export class ResetPasswordCommand extends Command<
  Result<boolean, DomainError>
> {
  constructor(public readonly opts: ResetPasswordDTO) {
    super();
  }
}

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(
    @InjectAccountRepository()
    private accountRepository: IAccountRepoistory,
    private captcha: CaptchaService,
    private readonly commandPublisher: CommandBus,
  ) {}
  async execute({
    opts,
  }: ResetPasswordCommand): Promise<Result<boolean, DomainError>> {
    const dto = opts;
    const account = await this.accountRepository.findByIdentValue(
      IdentEnum.EMAIL,
      dto.ident_value,
    );

    if (isErr(account)) {
      return err(new DomainError(account.error.message, account.error));
    }
    const accountRes = account.value;
    if (!accountRes) {
      return err(new AccountNotFound());
    }
    if (!dto.force) {
      const mfaResult = await this.captcha.verify(
        dto.mfa_code,
        accountRes.id,
        Channel.Email,
      );
      if (isErr(mfaResult)) {
        return err(new DomainError(mfaResult.error.message, mfaResult.error));
      }
      const mfaStatus = mfaResult.value;
      if (!mfaStatus) {
        return err(new InvalidMfa());
      }
    }

    accountRes.resetPassword(dto.password);

    const updateResult = await this.accountRepository.upsert(accountRes);
    if (isErr(updateResult)) {
      return err(
        new DomainError(updateResult.error.message, updateResult.error),
      );
    }
    await this.commandPublisher.execute(
      new AccountResetPasswordCommand(accountRes.id),
    );
    return ok(true);
  }
}
