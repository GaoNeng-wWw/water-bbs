import z from 'zod';
import { when } from './condition';
import { reward } from './reward';
import { schedule } from './schedule';

export const Version = z.number().min(1).max(1);

const schema = z.object({
  version: Version,
  name: z.string(),
  desc: z.string(),
  condition: when.describe('任务达成条件（完成即触发）'),
  claim: when.optional().describe('认领门槛（为空则完成即可领取）'),
  reward,
  schedule,
});

export type Task = z.infer<typeof schema>;

export default schema;
