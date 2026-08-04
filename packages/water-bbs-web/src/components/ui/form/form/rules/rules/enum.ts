import type { Rule } from './rule.type';

export const oneOf = <Cur extends string, FormObject, const Value extends string[]>(
  val: Value,
): Rule<Cur, FormObject> => {
  return (cur) => {
    if (val.some(v => v === cur)) {
      return true;
    }
    return { key: 'oneOf', params: { miss: val } };
  };
};

export const allOf = <Cur extends string, FormObject, const Value extends string[]>(
  val: Value,
): Rule<Cur, FormObject> => {
  return (cur) => {
    if (val.every(val => val === cur)) {
      return true;
    }
    const miss = val.filter(v => v !== cur);
    const hint = val.filter(v => v === cur);
    return { key: 'allOf', params: { miss, hint } };
  };
};
