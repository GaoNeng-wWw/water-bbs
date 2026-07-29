import { DomainError, InternalError } from '@app/shared';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Identifier, Credential, Account, Profile } from '../../entites';
import { UserExists } from 'src/auth/errors';
import { VerificationCodeService } from '@app/verification-code';
import { InjectRepository } from '@mikro-orm/nestjs';
import { InjectRegistor, Registor } from '../service';
import { Logger } from '@nestjs/common';

export class RegisterCommand extends Command<Result<void, DomainError>> {
  constructor(
    public readonly identType: string,
    public readonly identValue: string,
    public readonly credentialType: string,
    public readonly credentialValue: string,
    public readonly verificationCode: string,
    public readonly nick: string,
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
  ) {}
  async execute({
    identType,
    identValue,
    credentialType,
    credentialValue,
    nick,
    bio,
    verificationCode,
  }: RegisterCommand): Promise<Result<void, DomainError>> {
    const identifier = await this.identifierRepo.findOne({
      identType,
      identValue,
    });
    // TODO: Wait for feature module
    // const verify = await this.verification.verify({
    //   scene: 'register',
    //   receiver: identValue,
    //   code: verificationCode,
    // });
    // if (verify.isErr()) {
    //   return err(verify.error);
    // }
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
    this.em.persist(newAccount.value);
    this.em.persist(profile);
    await this.em.flush();
    return ok();
  }
}
