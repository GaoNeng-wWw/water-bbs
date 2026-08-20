import z from 'zod';
import { Definition, SetDefinition, uiSchema } from '../core';
import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

export const ResolverKey = Symbol('resolver');

export const ResolverHandlerMetadata =
  DiscoveryService.createDecorator<Definition<any, any, any>>();

export const Resolver = <
  UiSchema extends z.infer<typeof uiSchema>[],
  Param extends z.ZodType,
  Events extends unknown[],
>(
  def: Definition<UiSchema, Param, Events>,
) =>
  applyDecorators(
    Injectable(),
    ResolverHandlerMetadata(def),
    SetDefinition(def),
    SetMetadata(ResolverKey, true),
  );
