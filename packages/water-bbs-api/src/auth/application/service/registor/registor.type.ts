import { Result } from 'neverthrow';
import { Account } from '../../../entites';
import { DomainError } from '@app/shared';
import { Inject } from '@nestjs/common';

export type RegistorProps = {
  identType: string;
  identValue: string;
  credentialType: string;
  credentialValue: string;
  account: Account;
};

export const RegistorKey = Symbol('REGISTOR');
export const InjectRegistor = () => Inject(RegistorKey);

export interface Registor {
  validate(identType: string): Promise<boolean>;
  execute(props: RegistorProps): Promise<Result<Account, DomainError>>;
}
