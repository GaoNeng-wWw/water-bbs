import { z } from 'zod';

const PrimitiveValue = z.discriminatedUnion('type', [
  z.object({ type: z.literal('number'), value: z.number() }),
  z.object({ type: z.literal('string'), value: z.string() }),
  z.object({ type: z.literal('boolean'), value: z.boolean() }),
]);

export const ArrayValue = z.object({
  type: z.literal('array'),
  value: z.array(PrimitiveValue),
});

export const taggedValue = z.discriminatedUnion('type', [
  ...PrimitiveValue.options,
  ArrayValue,
]);

export const conditionSchema = z.strictObject({
  key: z.string(),
  field: z.string(),
  operator: z.string(),
  goal: taggedValue,
});

type WhenExpression =
  | { all: WhenExpression[] }
  | { any: WhenExpression[] }
  | z.infer<typeof conditionSchema>;

export const whenSchema: z.ZodType<WhenExpression> = z.lazy(() =>
  z.union([
    z.strictObject({ all: z.array(whenSchema).min(1) }),
    z.strictObject({ any: z.array(whenSchema).min(1) }),
    conditionSchema,
  ]),
);

export const actionItemSchema = z.looseObject({
  name: z.string(),
  param: z.record(z.string(), z.unknown()),
});

export const trigger = z.union([
  z.object({
    type: z.literal('event'),
    events: z.array(z.string()),
  }),
]);

export const rewardSchema = z.looseObject({
  version: z.string(),
  trigger,
  name: z.string(),
  desc: z.string(),
  icon: z.string().optional(),
  when: whenSchema,
  action: z.array(actionItemSchema).min(1),
});

export type IReward = z.infer<typeof rewardSchema>;
export type RewardAction = z.infer<typeof actionItemSchema>;
export type RewardWhenExpression = z.infer<typeof whenSchema>;
export type RewardWhenCondition = z.infer<typeof conditionSchema>;
export type RewardTaggedValue = z.infer<typeof taggedValue>;
export type RewardTaggedArrayValue = z.infer<typeof ArrayValue>;
export type RewardPrimitiveValue = z.infer<typeof PrimitiveValue>;
