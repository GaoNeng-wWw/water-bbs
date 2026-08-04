import type { Rule } from './rule.type';

export const regexp = <Cur extends string, FormObj>(regexp: RegExp): Rule<Cur, FormObj> => {
  return (cur) => {
    if (regexp.test(cur)) {
      return true;
    }
    return { key: 'regexp', params: { value: cur } };
  };
};
