import z from 'zod';

export const reward = z.array(
  z.object({
    use: z.string(),
    desc: z.record(z.string(), z.string()).optional(),
    args: z.record(z.string(), z.any()),
  }),
);
