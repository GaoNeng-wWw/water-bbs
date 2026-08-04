import type { Rule } from './rule.type';

export const required = <Cur, Form>(): Rule<Cur, Form> => {
  return (cur) => {
    if (cur === undefined) {
      return { key: 'required', params: {} };
    }
    return true;
  };
};
