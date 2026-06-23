import z from 'zod';

export type PolicyType<Schema = unknown> = {
  id: string;
  schema: Schema;
  value: Schema extends z.ZodType ? z.infer<Schema> : Record<string, any>;
};

export const definePolicy = <Id extends string, Schema = unknown, Value = Schema extends z.ZodType ? z.infer<Schema> : Record<string, any>>(
  id: Id,
  schema: Schema,
  value: Value,
) => {
  return {
    id,
    schema,
    value,
  } as PolicyType<Schema>;
};
