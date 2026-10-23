import z from 'zod';

const timezone = z
  .string()
  .min(1)
  .describe('IANA timezone, e.g. Asia/Shanghai');

const resetRule = z.discriminatedUnion('kind', [
  z
    .object({
      kind: z.literal('period'),
    })
    .describe('跟随 schedule.kind 的自然周期切分(daily → 每天,weekly → 每周)'),
  z.object({
    kind: z.literal('rolling'),
    days: z.number().int().positive(),
  }),
  z
    .object({
      kind: z.literal('never'),
    })
    .describe('整个任务生命周期只计算一次'),
]);

const baseScheduleFields = {
  timezone,
  startAt: z.string().datetime({ offset: true }),
  endAt: z.string().datetime({ offset: true }).optional(),
};

const onceSchedule = z.object({
  ...baseScheduleFields,
  kind: z.literal('once'),
});

const dailySchedule = z.object({
  ...baseScheduleFields,
  kind: z.literal('daily'),
  reset: resetRule.default({ kind: 'period' }),
});

const weeklySchedule = z.object({
  ...baseScheduleFields,
  kind: z.literal('weekly'),
  reset: resetRule.default({ kind: 'period' }),
  weekStart: z
    .number()
    .int()
    .min(1)
    .max(7)
    .default(1)
    .describe('周一为 1, 周日为 7'),
});

const monthlySchedule = z.object({
  ...baseScheduleFields,
  kind: z.literal('monthly'),
  reset: resetRule.default({ kind: 'period' }),
});

export const schedule = z.discriminatedUnion('kind', [
  onceSchedule,
  dailySchedule,
  weeklySchedule,
  monthlySchedule,
]);

export type Schedule = z.infer<typeof schedule>;
