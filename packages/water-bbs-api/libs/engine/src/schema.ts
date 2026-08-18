import { z } from 'zod';

const UICommonMeta = z.object({
  description: z.string().optional(),
  helper: z.string().optional(),
});

const textInput = z.object({
  type: z.literal('text'),
  name: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
});

const numberInput = z.object({
  type: z.literal('number'),
  name: z.string(),
  label: z.string(),
  min: z.number().optional(),
  max: z.number().optional(),
});

const option = z.object({
  label: z.string(),
  value: z.string(),
});

const select = z.object({
  type: z.literal('select'),
  name: z.string(),
  label: z.string(),
  options: z.array(option),
});
const switchSchema = z.object({
  type: z.literal('switch'),
  name: z.string(),
  label: z.string(),
  defaultValue: z.boolean().optional(),
});

export const UIFieldSchema = z.lazy(() =>
  z.discriminatedUnion('type', [
    textInput.extend(UICommonMeta),
    numberInput.extend(UICommonMeta),
    select.extend(UICommonMeta),
    switchSchema.extend(UICommonMeta),
    z
      .object({
        type: z.literal('group'),
        label: z.string(),
        children: z.array(UIFieldSchema),
      })
      .extend(UICommonMeta),
    z
      .object({
        type: z.literal('condition'),
        when: z.object({
          field: z.string(),
          equals: z.any(),
        }),
        children: z.array(UIFieldSchema),
      })
      .extend(UICommonMeta),
  ]),
);

export type UIFieldSchema = z.infer<typeof UIFieldSchema>;
