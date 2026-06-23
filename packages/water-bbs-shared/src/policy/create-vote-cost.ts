import z from 'zod';
import {
  definePolicy,
} from './type';

export default definePolicy(
  'policy.vote.create-cost',
  z.object({
    cost: z.number(),
  }),
  { cost: 10 },
);
