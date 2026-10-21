import type { Operator } from '@/types/when';
import type { Variable } from './context';

export const comparableValueType = ['number'];
export const equatableValueType = ['number', 'string', 'boolean', 'null'];
export type EquatableValueType = number | string | boolean | null;
export const isComparableValue = (val: unknown): val is number => typeof val === 'number';
export const isEquatableValue = (val: unknown): val is EquatableValueType => equatableValueType.includes(typeof val);

export const lt = (lhs: unknown, rhs: unknown) => {
  if (!isComparableValue(lhs) || !isComparableValue(rhs)) {
    return false;
  }
  return lhs < rhs;
};

export const lte = (lhs: unknown, rhs: unknown) => {
  if (!isComparableValue(lhs) || !isComparableValue(rhs)) {
    return false;
  }
  return lhs <= rhs;
};

export const gt = (lhs: unknown, rhs: unknown) => {
  if (!isComparableValue(lhs) || !isComparableValue(rhs)) {
    return false;
  }
  return lhs > rhs;
};

export const gte = (lhs: unknown, rhs: unknown) => {
  if (!isComparableValue(lhs) || !isComparableValue(rhs)) {
    return false;
  }
  return lhs >= rhs;
};

export const eq = (lhs: unknown, rhs: unknown) => {
  if (!isEquatableValue(lhs) || !isEquatableValue(rhs)) {
    return false;
  }
  return lhs === rhs;
};

export const neq = (lhs: unknown, rhs: unknown) => {
  if (!isEquatableValue(lhs) || !isEquatableValue(rhs)) {
    return false;
  }
  return lhs !== rhs;
};

export const eval_in = (lhs: unknown, rhs: unknown[]) => rhs.includes(lhs);
export const not_in = (lhs: unknown, rhs: unknown[]) => !eval_in(lhs, rhs);

export const evalCondition = (
  field: string,
  operator: Operator,
  goal: unknown,
  variable: Variable,
) => {
  const lhs = variable[field];
  if (lhs === undefined) {
    return false;
  }
  const rhs = goal;
  switch (operator) {
    case 'lt':
      return lt(lhs, rhs);
    case 'lte':
      return lte(lhs, rhs);
    case 'eq':
      return eq(lhs, rhs);
    case 'neq':
      return neq(lhs, rhs);
    case 'gt':
      return gt(lhs, rhs);
    case 'gte':
      return gte(lhs, rhs);
    case 'in':
      if (!Array.isArray(rhs)) {
        return false;
      }
      return eval_in(lhs, rhs);
    case 'not_in':
      if (!Array.isArray(rhs)) {
        return false;
      }
      return not_in(lhs, rhs);
  }
};
