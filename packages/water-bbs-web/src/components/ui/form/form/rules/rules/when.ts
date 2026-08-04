import type { Rule } from './rule.type';

export type Condition<Form extends Record<string, any>> = (value: Form) => boolean | Promise<boolean>;

export function when<Cur, FormObj>(
  condition: (formObject: FormObj) => boolean,
  rules: Rule<Cur, FormObj>[],
): Rule<Cur, FormObj> {
  return async (curValue, formObject) => {
    if (!condition(formObject)) {
      return true;
    }

    for (const rule of rules) {
      const result = await rule(curValue, formObject);

      if (result !== true) {
        return result;
      }
    }

    return true;
  };
}
