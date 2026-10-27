import { ApplicationError } from '@app/shared';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { err, ok, Result } from 'neverthrow';
import { TokenData } from 'src/auth/entites';
import { InvalidToken } from 'src/auth/errors';
import { RedisSessionRepository } from 'src/auth/infra';

export class Logout extends Command<Result<boolean, ApplicationError>> {
  constructor(public readonly token: string) {
    super();
  }
}

@CommandHandler(Logout)
export class LogoutService implements ICommandHandler<Logout> {
  constructor(
    private readonly jwt: JwtService,
    private readonly sessionRepository: RedisSessionRepository,
  ) {}
  async execute(command: Logout): Promise<Result<boolean, ApplicationError>> {
    const decodeResult = this.jwt.decode<TokenData>(
      command.token.replace('Bearer ', ''),
    );
    await this.sessionRepository.revokeSession(
      decodeResult.sub,
      decodeResult.sessionId,
    );
    return ok(true);
  }
}
