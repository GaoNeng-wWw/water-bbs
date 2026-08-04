import type { Rule } from './rule.type';

export const length = <Cur extends { length: number }, FormObject>(
  val: number,
): Rule<Cur, FormObject> => {
  return (cur) => {
    if (cur.length === val) {
      return true;
    }
    return { key: 'length', params: { indeedLength: cur.length, expectedLength: val } };
  };
};

export const minLength = <Cur extends { length: number }, FormObject>(
  val: number,
): Rule<Cur, FormObject> => {
  return (cur) => {
    if (cur.length >= val) {
      return true;
    }
    return { key: 'length', params: { indeedLength: cur.length } };
  };
};

export const maxLength = <Cur extends { length: number }, FormObject>(
  val: number,
): Rule<Cur, FormObject> => {
  return (cur) => {
    if (cur.length <= val) {
      return true;
    }
    return { key: 'length', params: { indeedLength: cur.length } };
  };
};
