import type { Rule } from './rule.type';

export const oneOf = <Cur extends string, FormObject>(
  f: Rule<Cur, FormObject>,
): Rule<Cur, FormObject> => {
  return (cur, formObj) => {
    return f(cur, formObj);
  };
};
