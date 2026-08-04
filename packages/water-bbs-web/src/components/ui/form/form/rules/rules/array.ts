import type { Rule } from './rule.type';


export const contains = <Cur, FormObject>(
  val: any[],
): Rule<Cur, FormObject> => {
  return (cur) => {
    if (
      val.findIndex(val => val === cur)
    ) {
      return true;
    }
    return { key: 'contains', params: { contains: val } };
  };
};
