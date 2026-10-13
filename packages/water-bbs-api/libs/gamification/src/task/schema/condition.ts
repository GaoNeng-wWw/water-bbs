import z from 'zod';
import { ValueType, Value } from './data-type';

export type Operator =
  'lt' | 'lte' | 'eq' | 'neq' | 'gt' | 'gte' | 'in' | 'not_in';
export type WhenExpression = {
  id: string;
  field: string;
  operator: Operator;
  goal: ValueType;
};
export type WhenNode =
  | {
      all: WhenNode[];
    }
  | {
      any: WhenNode[];
    }
  | {
      not: WhenNode[];
    }
  | WhenExpression[];
export type TopWhen =
  | {
      all: WhenNode[];
    }
  | {
      any: WhenNode[];
    }
  | {
      not: WhenNode[];
    };
const operator = z.enum([
  'lt',
  'lte',
  'eq',
  'neq',
  'gt',
  'gte',
  'in',
  'not_in',
]);
const whereExpression = z.object({
  id: z.string(),
  field: z.string(),
  operator,
  goal: Value,
});
const whenNode: z.ZodType<WhenNode> = z.lazy(() =>
  z.union([
    z.object({ all: z.array(whenNode) }),
    z.object({ any: z.array(whenNode) }),
    z.object({ not: z.array(whenNode) }),
    z.array(whereExpression),
  ]),
);
export const when = z.lazy(() => {
  return z.array(whenNode);
});
