import { EntityManager } from '@mikro-orm/core';
import { applyDecorators, Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { Result } from 'neverthrow';
import { z } from 'zod';
export const uiInputSchema = z.object({
  type: z.literal('input'),
  textType: z.enum(['password', 'text']),
});
export const uiSelect = z.object({
  type: z.literal('select'),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
});
export const uiCheckbox = z.object({
  type: z.literal('checkbox'),
});
export const uiBase = z.object({
  label: z.string().optional(),
  desc: z.string().optional(),
  tips: z.string().optional(),
});

export const uiSchema = z.discriminatedUnion('type', [
  uiInputSchema.extend(uiBase.shape),
  uiSelect.extend(uiBase.shape),
  uiCheckbox.extend(uiBase.shape),
]);

export type Context<Events extends unknown[] = []> = {
  em: EntityManager;
  events: Events;
};

export type Definition<
  UiSchema extends z.infer<typeof uiSchema>[],
  Param extends z.ZodType,
  Events extends unknown[],
> = {
  key: string;
  events: Events;
  param: Param;
  ui: UiSchema;
};

export type GetFromDefinition<
  Def extends Definition<any[], any, any[]>,
  Key extends 'ui-schema' | 'param' | 'events',
> =
  Def extends Definition<infer U, infer P, infer E>
    ? Key extends 'ui-schema'
      ? U
      : Key extends 'param'
        ? P
        : Key extends 'events'
          ? E
          : never
    : never;

export type Handler<
  UiSchema extends z.infer<typeof uiSchema>[],
  Param extends z.ZodType,
  Events extends unknown[],
> = {
  definition: Definition<UiSchema, Param, Events>;
  handle(
    param: z.infer<Param>,
    ctx: Context<Events>,
  ): Promise<Result<void, Error>>;
};

export const Key = Symbol('handler.metadata');

export const HandlerMetadata =
  DiscoveryService.createDecorator<Definition<any, any, any>>();

// 2. 新的 SetDefinition 使用 HandlerMetadata
export const SetDefinition = <
  UiSchema extends z.infer<typeof uiSchema>[],
  Param extends z.ZodType,
  Events extends unknown[],
>(
  def: Definition<UiSchema, Param, Events>,
) =>
  applyDecorators(
    Injectable(),
    HandlerMetadata(def as Definition<any, any, any>),
  );
