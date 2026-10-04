import { DiscoveryService } from '@nestjs/core';
import { RewardField } from '../schema';
import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { EntityManager } from '@mikro-orm/core';

export const FieldDecoratorKey = Symbol('FIELD');

export const FieldHandlerMetadata =
  DiscoveryService.createDecorator<RewardField>();

export const Field = (name: RewardField) => {
  return applyDecorators(
    FieldHandlerMetadata(name),
    SetMetadata(FieldDecoratorKey, name),
    Injectable(),
  );
};

export type FieldProviderContext = {
  em: EntityManager;
};

export type FieldProvider<Param, Return> = {
  provide(param: Param): Promise<Result<Return, DomainError>>;
};
