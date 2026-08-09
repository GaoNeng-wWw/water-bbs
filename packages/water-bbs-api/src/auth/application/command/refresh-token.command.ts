import { DomainError, randomAlphabet } from '@app/shared';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { TokenPair } from '../../dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { RedisSessionRepository, TokenRepository } from '../../infra';
import {
  AccessTokenData,
  createJti,
  createSessionId,
  RefreshTokenData,
  TokenData,
} from 'src/auth/entites';
import { InvalidToken, TokenExpired } from '../../errors';
import { ConfigureService } from '@app/configure';
import { TokenGenrator } from '../../domain';

export class RefreshToken extends Command<Result<TokenPair, DomainError>> {
  constructor(public readonly refreshToken: string) {
    super();
  }
}

@CommandHandler(RefreshToken)
export class RefreshTokenService implements ICommandHandler<RefreshToken> {
  constructor(
    private readonly jwt: JwtService,
    private readonly tokenGenerator: TokenGenrator,
    private readonly sessionRepo: RedisSessionRepository,
    private readonly tokenRepo: TokenRepository,
    private readonly config: ConfigureService,
  ) {}
  async execute({
    refreshToken: refreshTokenStr,
  }: RefreshToken): Promise<Result<TokenPair, DomainError>> {
    try {
      const verifyResult = this.jwt.verify<TokenData>(
        refreshTokenStr.replace('Bearer ', ''),
      );
      if (!('accessTokenJti' in verifyResult)) {
        return err(new InvalidToken());
      }
      const realRefreshToken = await this.tokenRepo.getTokenByJti(
        verifyResult.jti,
      );
      if (!realRefreshToken) {
        return err(new TokenExpired());
      }
      const sessionId = createSessionId();
      const accessTokenTTL = this.config.get('token.accessTokenTTL');
      const refreshTokenTTL = this.config.get('token.refreshTokenTTL');
      const accessTokenData: AccessTokenData = {
        jti: createJti(),
        nonce: randomAlphabet(24),
        sessionId,
        sub: verifyResult.sub,
      };
      const refreshTokenData: RefreshTokenData = {
        jti: createJti(),
        nonce: randomAlphabet(32),
        sessionId,
        sub: verifyResult.sub,
        accessTokenJti: accessTokenData.jti,
      };
      const accessToken = await this.tokenGenerator.generator({
        ...accessTokenData,
        ttl: accessTokenTTL,
      });
      const refreshToken = await this.tokenGenerator.generator({
        ...refreshTokenData,
        ttl: refreshTokenTTL,
        accessTokenJti: accessTokenData.jti,
      });
      await this.sessionRepo.refreshToken({
        uid: verifyResult.sub,
        newSessionId: sessionId,
        newAccessToken: accessToken,
        newRefreshToken: refreshToken,
        newAccessTokenJti: accessTokenData.jti,
        newRefreshTokenJti: accessTokenData.jti,
        accessTokenTTL: accessTokenTTL.toString(),
        refreshTokenTTL: refreshTokenTTL.toString(),
        sessionIssueAt: new Date().getTime().toString(),
        oldSessionId: verifyResult.sessionId,
      });
      return ok(
        new TokenPair({
          accessToken,
          refreshToken,
          accessTokenTTL,
          refreshTokenTTL,
        }),
      );
    } catch (error) {
      console.log(error);
      if (error instanceof TokenExpiredError) {
        return err(new TokenExpired());
      }
      return err(new InvalidToken(error as Error));
    }
  }
}
