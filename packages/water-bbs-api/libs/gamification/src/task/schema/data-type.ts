import z from 'zod';

export const string = z.string();
export const boolean = z.boolean();
export const number = z.number();
export const nil = z.null();
export const array = z.lazy(() => z.array(Value));

export type ValueType = string | boolean | number | null | ValueType[];

export const Value: z.ZodType<ValueType> = z.lazy(() => {
  return z.union([string, boolean, number, nil, array]);
});
