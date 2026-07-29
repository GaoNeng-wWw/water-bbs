import { DomainError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { CredentialVerifier } from './verifier';
import { Injectable } from '@nestjs/common';
import { Credential } from '../../../entites';

@Injectable()
export class PasswordVerifier implements CredentialVerifier {
  validate(credentialType: string): boolean {
    return credentialType.toLowerCase().trim() === 'password';
  }
  run(
    credential: Credential,
    credentialValue: string,
  ): Promise<Result<boolean, DomainError>> {
    return Promise.resolve(ok(credential.verify(credentialValue)));
  }
}
