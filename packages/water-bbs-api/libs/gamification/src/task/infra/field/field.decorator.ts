import { InfraError } from '@app/shared';
import { EntityManager } from '@mikro-orm/core';
import { Result } from 'neverthrow';
import z from 'zod';
import { Fields } from '../../schema';
import { DiscoveryService } from '@nestjs/core';
import { AccountId } from 'src/auth';

export type FieldMetadata = {
  name: Fields;
  schema: z.ZodType;
};

export type FieldProviderContext = {
  em: EntityManager;
  accountID: AccountId;
};

export type IFieldProvider<Schema extends z.ZodType, ReturnType> = {
  execute(
    params: z.infer<Schema>,
    context: FieldProviderContext,
  ): Promise<Result<ReturnType | null, InfraError>>;
};

export const FieldKey = Symbol.for('field');
export const Field = DiscoveryService.createDecorator<FieldMetadata>();
