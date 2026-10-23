import z from 'zod';

export const reward = z.array(
  z.object({
    use: z.string(),
    args: z.record(z.string(), z.any()),
  }),
);
