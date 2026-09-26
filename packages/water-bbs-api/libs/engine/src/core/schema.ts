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
export const uiDatePicker = z.object({
  type: z.literal('date-picker'),
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
  uiDatePicker.extend(uiBase.shape),
]);

export type Context = {
  em: EntityManager;
};

export type Definition<
  UiSchema extends z.infer<typeof uiSchema>[] = z.infer<typeof uiSchema>[],
  Param extends z.ZodType = ZodType,
> = {
  key: string;
  param: Param;
  ui: UiSchema;
};

export type Handler<D extends Definition> = {
  handle(
    param: z.infer<D['param']>,
    ctx: Context,
  ): Promise<Result<void, Error>>;
};
