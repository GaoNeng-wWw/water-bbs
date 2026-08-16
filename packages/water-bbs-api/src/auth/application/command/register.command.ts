import { DomainError, InternalError } from '@app/shared';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Identifier, Account, Profile, AccountId } from '../../entites';
import { UserExists } from 'src/auth/errors';
import { VerificationCodeService } from '@app/verification-code';
import { InjectRepository } from '@mikro-orm/nestjs';
import { InjectRegistor, Registor } from '../service';
import { Logger } from '@nestjs/common';
import { ConfigureService } from '@app/configure';
import { Wallet, WalletService } from '@app/gamification';

export class RegisterCommand extends Command<Result<AccountId, DomainError>> {
  constructor(
    public readonly identType: string,
    public readonly identValue: string,
    public readonly credentialType: string,
    public readonly credentialValue: string,
    public readonly nick: string,
    public readonly verificationCode?: string,
    public readonly bio?: string,
  ) {
    super();
  }
}

@CommandHandler(RegisterCommand)
export class RegisterService implements ICommandHandler<RegisterCommand> {
  private readonly logger = new Logger(RegisterService.name);
  constructor(
    @InjectRepository(Identifier)
    private readonly identifierRepo: EntityRepository<Identifier>,
    private readonly em: EntityManager,
    private readonly verification: VerificationCodeService,
    @InjectRegistor()
    private readonly registor: Registor[],
    private readonly configure: ConfigureService,
    private readonly walletService: WalletService,
  ) {}
  async execute({
    identType,
    identValue,
    credentialType,
    credentialValue,
    nick,
    bio,
    verificationCode,
  }: RegisterCommand): Promise<Result<AccountId, DomainError>> {
    const identifier = await this.identifierRepo.findOne({
      identType,
      identValue,
    });
    const feature = this.configure.get('feature.verificationCodeOnRegister');
    if (feature) {
      const verify = await this.verification.verify({
        scene: 'register',
        receiver: identValue,
        code: verificationCode,
      });
      if (verify.isErr()) {
        return err(verify.error);
      }
    }
    if (identifier) {
      return err(new UserExists());
    }
    const account = this.em.create(Account, {});
    const [registor] = await Promise.all(
      this.registor.map((r) => r.validate(identType).then(() => r)),
    );
    if (!registor) {
      this.logger.warn(`Can not find any registor`);
      return err(new InternalError());
    }
    const newAccount = await registor.execute({
      account,
      identType,
      identValue,
      credentialType,
      credentialValue,
    });
    if (newAccount.isErr()) {
      return err(newAccount.error);
    }
    const profile = this.em.create(Profile, {
      accountId: newAccount.value.id,
      nick,
      bio,
    });
    await this.em.transactional((em) => {
      em.persist(newAccount.value);
      em.persist(profile);
      const wallet = this.em.create(Wallet, {
        balanceSnapshot: 0n,
        id: newAccount.value.id,
      });
      em.persist(wallet);
    });
    return ok(newAccount.value.id);
  }
}
