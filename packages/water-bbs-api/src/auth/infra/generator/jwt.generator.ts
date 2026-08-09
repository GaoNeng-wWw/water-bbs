import { Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GenratorProps, TokenGenrator } from '../../domain';
import { randomAlphabet } from '@app/shared';

@Injectable({ scope: Scope.REQUEST })
export class JwtGenerator implements TokenGenrator {
  constructor(private readonly jwt: JwtService) {}
  generator<AdditionalData extends Record<string, any>>({
    sessionId,
    ttl,
    sub,
    ...additionalData
  }: GenratorProps<AdditionalData>): Promise<string> {
    return this.jwt.signAsync(
      { sessionId, sub, ...additionalData, nonce: randomAlphabet(64) },
      { expiresIn: ttl },
    );
  }
}
