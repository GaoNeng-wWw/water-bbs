import type { Rule } from './rule.type';

export const min = <Cur extends number, FormObject>(
  val: number,
): Rule<Cur, FormObject> => {
  return (cur) => {
    if (cur >= val) {
      return true;
    }
    return { key: 'max', params: { min: val } };
  };
};

export const max = <Cur extends number, FormObject>(
  val: number,
): Rule<Cur, FormObject> => {
  return (cur) => {
    if (cur <= val) {
      return true;
    }
    return { key: 'max', params: { max: val } };
  };
};

export const between = <Cur extends number, FormObject>(
  [a, b]: [number, number],
): Rule<Cur, FormObject> => {
  return (cur) => {
    if (cur >= a && cur <= b) {
      return true;
    }
    return { key: 'between', params: { range: [a, b] } };
  };
};
