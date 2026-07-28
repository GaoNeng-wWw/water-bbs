import { DomainError } from '@app/shared';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Identifier, Credential, Account, Profile } from '../../entites';
import { UserExists } from 'src/auth/errors';
import { VerificationCodeService } from '@app/verification-code';
import { InjectRepository } from '@mikro-orm/nestjs';

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
  constructor(
    @InjectRepository(Identifier)
    private readonly identifierRepo: EntityRepository<Identifier>,
    private readonly em: EntityManager,
    private readonly verification: VerificationCodeService,
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
    const verify = await this.verification.verify({
      scene: 'register',
      receiver: identValue,
      code: verificationCode,
    });
    if (verify.isErr()) {
      return verify;
    }
    if (identifier) {
      return err(new UserExists());
    }
    const ident = this.em.create(Identifier, {
      identType,
      identValue,
      verified: false,
    });
    this.em.persist(ident);
    const credential = this.em.create(Credential, {
      credentialType,
      credentialValue,
      identifier: ident,
    });
    this.em.persist(credential);
    ident.credentials.add(credential);
    const account = this.em.create(Account, {
      identifier_id: ident.id,
    });
    this.em.persist(account);
    const profile = this.em.create(Profile, {
      account,
      accountId: account.id,
      nick,
      bio,
    });
    account.profile = profile;
    this.em.persist(profile);
    await this.em.flush();
    return ok();
  }
}
