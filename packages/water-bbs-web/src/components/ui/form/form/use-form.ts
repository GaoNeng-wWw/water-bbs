import { computed, reactive, ref, toRaw, toValue } from 'vue';
import type { FormRules, RuleResult } from './rules';

export type UseFormProps<T extends Record<string, any>> = {
  model: T;
  rules: FormRules<T>;
};

export type ValidateResult<T extends Record<string, any>> = {
  field: keyof T;
  errorDetails: Exclude<RuleResult, true>[];
};

const ruleRunner = <T extends Record<string, any>>(rules: FormRules<T>) => {
  return async (model: T) => {
    const keys = Object.keys(model);
    const ret: ValidateResult<T>[] = [];
    for (const key of keys) {
      const value = model[key];
      const rule = rules[key];
      if (!rule) {
        continue;
      }
      const tasks = rule.map(r => r(value, model));
      const errorDetails = await Promise.all(tasks)
        .then(result => result.filter(v => v !== true));
      if (!errorDetails.length) {
        continue;
      }
      ret.push({ field: key, errorDetails: errorDetails });
    }
    return Promise.resolve(ret);
  };
};

export type SetValueProps = { validate?: boolean };

export const useForm = <T extends Record<string, any> = Record<string, any>>(props: UseFormProps<T>) => {
  const initialModel = structuredClone(props.model);
  const model = reactive<T>(structuredClone(initialModel));
  const runner = ruleRunner(props.rules);
  const validateResult = ref<ValidateResult<T>[]>([]);
  const invalid = computed(() => Boolean(validateResult.value.length));
  const clearInvalid = () => {
    validateResult.value = [];
  };
  const validate = () => {
    return runner(toValue(model)).then((result) => {
      validateResult.value = result;
    });
  };
  const setValue = <K extends keyof T>(key: K, value: T[K], props?: SetValueProps) => {
    (model as T)[key] = value;
    if (props?.validate) {
      return validate();
    }
    return Promise.resolve();
  };
  const validateField = async <K extends keyof T>(key: K) => {
    const rules = props.rules[key];
    if (!rules || !rules.length) {
      return [];
    }
    const errors: Exclude<RuleResult, true>[] = [];
    const raw = toValue(model);
    for (const rule of rules) {
      const verifyResult = await rule(raw[key], raw);
      if (typeof verifyResult === 'boolean') {
        continue;
      }
      errors.push(verifyResult);
    }
    return errors;
  };
  const resetValue = <K extends keyof T>(key: K) => {
    (model as T)[key] = initialModel[key];
  };
  return {
    invalid,
    clearInvalid,
    validate,
    setValue,
    resetValue,
    validateField,
  };
};
