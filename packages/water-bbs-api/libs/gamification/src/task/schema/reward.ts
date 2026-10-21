import z from 'zod';
import { pointRewardSchema } from '../infra/reward';

export const rewardBase = z.array(
  z.object({
    use: z.string(),
    desc: z.record(z.string(), z.string()).optional(),
    args: z.record(z.string(), z.any()),
  }),
);

export const reward = z.array(z.discriminatedUnion('use', [pointRewardSchema]));
