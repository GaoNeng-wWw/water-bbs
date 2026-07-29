import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { DomainError, InternalError, randomAlphabet } from '@app/shared';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConfigureService } from '@app/configure';
import { TokenPair } from '../../dto';
import {
  Identifier,
  createSessionId,
  AccessTokenData,
  createJti,
  RefreshTokenData,
  Credential,
} from '../../entites';
import { UserNotExists, PasswordIncorrect } from '../../errors';
import { RedisSessionRepository } from '../../infra';
import { CredentialVerifier } from '../service/credential-verifer/verifier';
import { TokenGenrator } from 'src/auth/domain';
import { Inject } from '@nestjs/common';

export class Login extends Command<Result<TokenPair, DomainError>> {
  constructor(
    public readonly identType: string,
    public readonly identValue: string,
    public readonly credentialType: string,
    public readonly credentialValue: string,
  ) {
    super();
  }
}

@CommandHandler(Login)
export class LoginService implements ICommandHandler<Login> {
  constructor(
    private readonly jwt: TokenGenrator,
    @InjectRepository(Identifier)
    private readonly identRepo: EntityRepository<Identifier>,
    @InjectRepository(Credential)
    private readonly credentialRepo: EntityRepository<Credential>,
    @Inject(CredentialVerifier)
    private readonly credentialVerifier: CredentialVerifier[],
    private readonly sessionRepository: RedisSessionRepository,
    private readonly config: ConfigureService,
  ) {}
  async execute({
    identType,
    identValue,
    credentialType,
    credentialValue,
  }: Login): Promise<Result<TokenPair, DomainError>> {
    const [verifier] = this.credentialVerifier.filter((cred) =>
      cred.validate(credentialType),
    );
    if (!verifier) {
      return err(new InternalError());
    }
    const identifier = await this.identRepo.findOne({ identType, identValue });
    if (!identifier) {
      return err(new UserNotExists());
    }
    const credential = await this.credentialRepo.findOne({
      credentialType,
    });
    if (!credential) {
      return err(new UserNotExists());
    }
    const state = await verifier.run(credential, credentialValue);
    if (state.isErr()) {
      return err(state.error);
    }
    if (!state.value) {
      return err(new PasswordIncorrect());
    }

    const account = identifier.account;
    if (!account) {
      return err(new UserNotExists());
    }
    const sessionId = createSessionId();
    const accessTokenTTL = this.config.get('token.accessTokenTTL');
    const refreshTokenTTL = this.config.get('token.refreshTokenTTL');
    const accessTokenData: AccessTokenData = {
      jti: createJti(),
      nonce: randomAlphabet(24),
      sessionId,
      sub: account.id,
    };
    const refreshTokenData: RefreshTokenData = {
      jti: createJti(),
      nonce: randomAlphabet(32),
      sessionId,
      sub: account.id,
      accessTokenJti: accessTokenData.jti,
    };
    const accessToken = await this.jwt.generator({
      ...accessTokenData,
      ttl: accessTokenTTL,
    });
    const refreshToken = await this.jwt.generator({
      ...refreshTokenData,
      ttl: refreshTokenTTL,
    });
    await this.sessionRepository.issueToken({
      sessionId,
      sessionIssueAt: new Date().getTime().toString(),
      accessToken,
      accessTokenJti: accessTokenData.jti,
      refreshToken,
      refreshTokenJti: refreshTokenData.jti,
      uid: account.id.toString(),
      accessTokenTTL: accessTokenTTL.toString(),
      refreshTokenTTL: refreshTokenTTL.toString(),
      sessionLimit: '1',
    });
    return ok(
      new TokenPair({
        accessToken,
        accessTokenTTL,
        refreshToken,
        refreshTokenTTL,
      }),
    );
  }
}
