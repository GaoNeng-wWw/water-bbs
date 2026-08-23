import { EntityManager } from '@mikro-orm/core';
import { Result } from 'neverthrow';
import { z, ZodType } from 'zod';
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
  UiSchema extends z.infer<typeof uiSchema>[] = z.infer<typeof uiSchema>[],
  Param extends z.ZodType = ZodType,
  Events extends unknown[] = [],
> = {
  key: string;
  events: Events;
  param: Param;
  ui: UiSchema;
};

export type Handler<D extends Definition> = {
  handle(
    param: z.infer<D['param']>,
    ctx: Context<D['events']>,
  ): Promise<Result<void, Error>>;
};
