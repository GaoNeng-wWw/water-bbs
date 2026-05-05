import { Inject } from '@nestjs/common';
import { Profile } from 'water-bbs-migration';
import { DomainError, Result } from 'water-bbs-shared';

export type RegistorProp = {
  ident_type: string;
  ident_value: string;
  cert_type: string;
  cert_value: string;
  profile: Profile;
};

export const ACCOUNT_RESGISTOR_REJECTION_KEY = Symbol('ACCOUNT_REGISTOR');
export const InjectAccountRegistor = () =>
  Inject(ACCOUNT_RESGISTOR_REJECTION_KEY);

export interface AccountRegistor {
  valid(ident_type: string): boolean;
  execute(prop: RegistorProp): Promise<Result<boolean, DomainError>>;
}
