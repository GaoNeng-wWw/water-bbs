import { DomainError } from '@app/shared';
import { Result } from 'neverthrow';
import { Credential } from '../../../entites';

export abstract class CredentialVerifier {
  abstract validate(credentialType: string): boolean;
  abstract run(
    credential: Credential,
    credentialValue: string,
  ): Promise<Result<boolean, DomainError>>;
}
