import { Result } from 'neverthrow';
import { Identifier } from '../../../entites';
import { DomainError } from '@app/shared';
import { Inject } from '@nestjs/common';

export type RegistorProps = {
  identType: string;
  identValue: string;
  certType: string;
  certValue: string;
};

export const RegistorKey = Symbol('REGISTOR');
export const InjectRegistorKey = () => Inject(RegistorKey);

export interface Registor {
  validate(identType: string): Promise<boolean>;
  execute(props: RegistorProps): Promise<Result<Identifier, DomainError>>;
}
