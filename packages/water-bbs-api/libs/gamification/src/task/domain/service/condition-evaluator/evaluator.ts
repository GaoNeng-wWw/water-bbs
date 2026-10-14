import { DomainError } from '@app/shared';
import { Fields, ValueType, WhenNode } from '../../../schema';
import { err, ok, Result } from 'neverthrow';
import { ExpectTypeError } from '../error';

const isArray = (val: unknown): val is ValueType[] => Array.isArray(val);
const isNumber = (val: unknown): val is number => typeof val === 'number';

export type Context = {
  [f in Fields]?: any;
};
export type ConditionFunction = (
  lhs: ValueType,
  rhs: ValueType,
) => Result<boolean, DomainError>;

export const onLt: ConditionFunction = (lhs: ValueType, rhs: ValueType) => {
  if (!isNumber(lhs)) {
    return err(new ExpectTypeError('number', typeof lhs));
  }
  if (!isNumber(rhs)) {
    return err(new ExpectTypeError('number', typeof rhs));
  }
  return ok(lhs < rhs);
};
export const onLte: ConditionFunction = (lhs: ValueType, rhs: ValueType) => {
  if (!isNumber(lhs)) {
    return err(new ExpectTypeError('number', typeof lhs));
  }
  if (!isNumber(rhs)) {
    return err(new ExpectTypeError('number', typeof rhs));
  }
  return ok(lhs <= rhs);
};
export const onGt: ConditionFunction = (lhs: ValueType, rhs: ValueType) => {
  if (!isNumber(lhs)) {
    return err(new ExpectTypeError('number', typeof lhs));
  }
  if (!isNumber(rhs)) {
    return err(new ExpectTypeError('number', typeof rhs));
  }
  return ok(lhs > rhs);
};
export const onGte: ConditionFunction = (lhs: ValueType, rhs: ValueType) => {
  if (!isNumber(lhs)) {
    return err(new ExpectTypeError('number', typeof lhs));
  }
  if (!isNumber(rhs)) {
    return err(new ExpectTypeError('number', typeof rhs));
  }
  return ok(lhs >= rhs);
};
export const onEq: ConditionFunction = (lhs: ValueType, rhs: ValueType) => {
  return ok(lhs === rhs);
};
export const onIn: ConditionFunction = (lhs: ValueType, rhs: ValueType) => {
  if (!isArray(rhs)) {
    return err(new ExpectTypeError('array', typeof rhs));
  }
  if (isArray(lhs)) {
    return err(new ExpectTypeError('literal', typeof lhs));
  }
  return ok(rhs.includes(lhs));
};
export const onNotIn: ConditionFunction = (lhs: ValueType, rhs: ValueType) => {
  const result = onIn(lhs, rhs);
  if (result.isErr()) {
    return result;
  }
  return ok(!result.value);
};

export const evalCondition = (
  node: WhenNode,
  context: Context,
): Result<boolean, DomainError> => {
  if ('all' in node) {
    const res = node.all.map((node) => {
      const v = evalCondition(node, context);
      return v.isOk() ? v.value : v.error;
    });
    const [fail] = res.filter((r) => typeof r !== 'boolean');
    if (fail) {
      return err(fail);
    }
    return ok(res.every((value) => value));
  }
  if ('any' in node) {
    const res = node.any.map((node) => {
      const v = evalCondition(node, context);
      return v.isOk() ? v.value : v.error;
    });
    const [fail] = res.filter((r) => typeof r !== 'boolean');
    if (fail) {
      return err(fail);
    }
    return ok(res.some((value) => value));
  }
  if ('not' in node) {
    const res = node.not.map((node) => {
      const v = evalCondition(node, context);
      return v.isOk() ? v.value : v.error;
    });
    const [fail] = res.filter((r) => typeof r !== 'boolean');
    if (fail) {
      return err(fail);
    }
    return ok(res.every((result) => !result));
  }
  const value = context[node.field];
  if (value === undefined) {
    return err(new ExpectTypeError('literal', typeof value));
  }
  switch (node.operator) {
    case 'lt':
      return onLt(value, node.goal);
    case 'lte':
      return onLte(value, node.goal);
    case 'gt':
      return onGt(value, node.goal);
    case 'gte':
      return onGte(value, node.goal);
    case 'eq':
      return onEq(value, node.goal);
    case 'neq':
      return onEq(value, node.goal).map((result) => !result);
    case 'in':
      return onIn(value, node.goal);
    case 'not_in':
      return onNotIn(value, node.goal);
  }
};
