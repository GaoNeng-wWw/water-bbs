export type RuleResult =
  | true
  | {
    key: string;
    params?: Record<string, unknown>;
  };
export type Rule<Cur, FormObj> = (
  curValue: Cur,
  formObject: FormObj
) => RuleResult | Promise<RuleResult>;
export type FormRules<T> = {
  [K in keyof T]?: Rule<T[K], T>[]
};
