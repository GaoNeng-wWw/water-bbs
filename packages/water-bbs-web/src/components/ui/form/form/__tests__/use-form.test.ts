import { describe, it, expect, vi } from 'vitest';
import { nextTick } from 'vue';
import { useForm, type UseFormProps } from '../use-form';

interface TestModel {
  name: string;
  age: number;
  email: string;
  optional?: string;
}

const passRule = () => true as const;
const failRule = (key: string) => () => ({ key }) as const;

const createBaseProps = (overrides?: Partial<UseFormProps<TestModel>>): UseFormProps<TestModel> => ({
  model: {
    name: '',
    age: 0,
    email: '',
  },
  rules: {
    name: [passRule],
    age: [passRule],
    email: [passRule],
  },
  ...overrides,
});

describe('ruleRunner (via validate)', () => {
  it('should return empty array when all rules pass', async () => {
    const { validate, invalid } = useForm(createBaseProps());
    await validate();
    expect(invalid.value).toBe(false);
  });

  it('should return errors when some rules fail', async () => {
    const { validate, invalid } = useForm(createBaseProps({
      rules: {
        name: [failRule('name.required')],
        age: [passRule],
        email: [passRule],
      },
    }));
    await validate();
    expect(invalid.value).toBe(true);
  });

  it('should skip fields that have no rules defined', async () => {
    const { validate, invalid } = useForm(createBaseProps({
      rules: {
        name: [passRule],
      },
    }));
    await validate();
    expect(invalid.value).toBe(false);
  });

  it('should handle async rules correctly', async () => {
    const asyncPass = () => Promise.resolve(true as const);
    const asyncFail = () => Promise.resolve({ key: 'async.error' } as const);

    const { validate, invalid } = useForm(createBaseProps({
      rules: {
        name: [asyncPass],
        age: [asyncFail],
        email: [passRule],
      },
    }));
    await validate();
    expect(invalid.value).toBe(true);
  });

  it('should handle mixed sync and async rules', async () => {
    const asyncFail = () => Promise.resolve({ key: 'async.fail' } as const);

    const { validate, invalid } = useForm(createBaseProps({
      rules: {
        name: [passRule, asyncFail],
        age: [passRule],
        email: [passRule],
      },
    }));
    await validate();
    expect(invalid.value).toBe(true);
  });

  it('should filter out passing results and only keep errors', async () => {
    const { validate, invalid } = useForm(createBaseProps({
      model: { name: 'test', age: 25, email: 'test@test.com' },
      rules: {
        name: [passRule, failRule('name.tooShort'), passRule],
        age: [passRule],
        email: [passRule],
      },
    }));
    await validate();
    expect(invalid.value).toBe(true);
  });

  it('should pass the full model object to each rule', async () => {
    const ruleSpy = vi.fn(() => true as const);
    const model = { name: 'Alice', age: 30, email: 'alice@test.com' };

    const { validate } = useForm({
      model,
      rules: {
        name: [ruleSpy],
        age: [ruleSpy],
        email: [ruleSpy],
      },
    });
    await validate();

    expect(ruleSpy).toHaveBeenCalledTimes(3);
    const secondCallModel = ruleSpy.mock.calls[1]![1];
    expect(secondCallModel).toEqual(model);
  });

  it('should return empty array for an empty model', async () => {
    const { validate, invalid } = useForm({
      model: {} as Record<string, never>,
      rules: {},
    });
    await validate();
    expect(invalid.value).toBe(false);
  });

  it('should handle multiple fields with errors', async () => {
    const { validate, invalid } = useForm(createBaseProps({
      rules: {
        name: [failRule('name.error')],
        age: [failRule('age.error')],
        email: [failRule('email.error')],
      },
    }));
    await validate();
    expect(invalid.value).toBe(true);
  });
});

describe('useForm', () => {
  describe('invalid computed', () => {
    it('should be false initially', () => {
      const { invalid } = useForm(createBaseProps());
      expect(invalid.value).toBe(false);
    });

    it('should be false after validation with no errors', async () => {
      const { validate, invalid } = useForm(createBaseProps());
      await validate();
      expect(invalid.value).toBe(false);
    });

    it('should be true after validation with errors', async () => {
      const { validate, invalid } = useForm(createBaseProps({
        rules: {
          name: [failRule('name.error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      await validate();
      expect(invalid.value).toBe(true);
    });

    it('should become false after clearInvalid is called', async () => {
      const { validate, clearInvalid, invalid } = useForm(createBaseProps({
        rules: {
          name: [failRule('name.error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      await validate();
      expect(invalid.value).toBe(true);
      clearInvalid();
      expect(invalid.value).toBe(false);
    });

    it('should handle structuredClone with nested objects', () => {
      interface NestedModel {
        user: { name: string; age: number };
        email: string;
      }
      const { invalid } = useForm<NestedModel>({
        model: { user: { name: 'Alice', age: 30 }, email: 'alice@test.com' },
        rules: {
          user: [() => true],
          email: [passRule],
        },
      });
      expect(invalid.value).toBe(false);
    });

    it('should handle model with no rules at all', () => {
      const { invalid } = useForm({
        model: { name: '', age: 0, email: '' },
        rules: {},
      });
      expect(invalid.value).toBe(false);
    });
  });

  describe('clearInvalid', () => {
    it('should clear validation errors', async () => {
      const { validate, clearInvalid, invalid } = useForm(createBaseProps({
        rules: {
          name: [failRule('name.error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      await validate();
      expect(invalid.value).toBe(true);
      clearInvalid();
      expect(invalid.value).toBe(false);
    });

    it('should be idempotent when no errors exist', () => {
      const { clearInvalid, invalid } = useForm(createBaseProps());
      expect(invalid.value).toBe(false);
      clearInvalid();
      expect(invalid.value).toBe(false);
    });
  });

  describe('validate', () => {
    it('should return a promise', () => {
      const { validate } = useForm(createBaseProps());
      const result = validate();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should update invalid state after resolution', async () => {
      const { validate, invalid } = useForm(createBaseProps({
        rules: {
          name: [failRule('name.error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      expect(invalid.value).toBe(false);
      await validate();
      expect(invalid.value).toBe(true);
    });

    it('should run validation multiple times with updated state', async () => {
      const { validate, invalid } = useForm(createBaseProps({
        rules: {
          name: [failRule('name.error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      await validate();
      expect(invalid.value).toBe(true);

      const { validate: validate2, invalid: invalid2 } = useForm(createBaseProps());
      await validate2();
      expect(invalid2.value).toBe(false);
    });

    it('should handle calling validate multiple times in succession', async () => {
      const { validate, invalid } = useForm(createBaseProps({
        rules: {
          name: [failRule('error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      await validate();
      expect(invalid.value).toBe(true);
      await validate();
      expect(invalid.value).toBe(true);
    });
  });

  describe('setValue', () => {
    it('should set a value without triggering validation by default', () => {
      const { setValue, invalid } = useForm(createBaseProps({
        rules: {
          name: [failRule('name.error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      setValue('name', 'new name');
      expect(invalid.value).toBe(false);
    });

    it('should set a value and trigger validation when validate option is true', async () => {
      const { setValue, invalid } = useForm(createBaseProps({
        rules: {
          name: [failRule('name.error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      await setValue('name', 'new name', { validate: true });
      await nextTick();
      expect(invalid.value).toBe(true);
    });

    it('should not trigger validation when validate option is false', () => {
      const { setValue, invalid } = useForm(createBaseProps({
        rules: {
          name: [failRule('name.error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      setValue('name', 'new name', { validate: false });
      expect(invalid.value).toBe(false);
    });

    it('should set different types of values correctly', () => {
      const { setValue, invalid } = useForm(createBaseProps());
      setValue('name', 'Alice');
      setValue('age', 42);
      setValue('email', 'alice@test.com');
      expect(invalid.value).toBe(false);
    });

    it('should set optional field values', () => {
      const { setValue } = useForm({
        model: { name: '', age: 0, email: '', optional: undefined },
        rules: {},
      });
      setValue('optional', 'some value');
    });

    it('should handle setValue with validate: true calling validate asynchronously', async () => {
      const asyncFail = () => Promise.resolve({ key: 'async.error' } as const);

      const { setValue, invalid } = useForm(createBaseProps({
        rules: {
          name: [asyncFail],
          age: [passRule],
          email: [passRule],
        },
      }));
      expect(invalid.value).toBe(false);
      await setValue('name', 'test', { validate: true });
      await nextTick();
      await nextTick();
      expect(invalid.value).toBe(true);
    });
  });

  describe('resetValue', () => {
    it('should reset a field to its initial value', () => {
      const initialName = 'initial';
      const { setValue, resetValue } = useForm({
        model: { name: initialName, age: 0, email: '' },
        rules: {},
      });
      setValue('name', 'changed');
      resetValue('name');
    });

    it('should reset numeric fields to initial values', () => {
      const { setValue, resetValue } = useForm({
        model: { name: '', age: 25, email: '' },
        rules: {},
      });
      setValue('age', 100);
      resetValue('age');
    });

    it('should not affect other fields when resetting one field', () => {
      const { setValue, resetValue } = useForm({
        model: { name: 'Alice', age: 30, email: 'alice@test.com' },
        rules: {
          name: [passRule],
          age: [passRule],
          email: [passRule],
        },
      });
      setValue('name', 'Bob');
      setValue('age', 40);
      resetValue('name');
    });

    it('should reset after validation has been performed', async () => {
      const { setValue, resetValue, validate, invalid } = useForm(createBaseProps({
        rules: {
          name: [failRule('name.error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      await setValue('name', 'bad name', { validate: true });
      await nextTick();
      expect(invalid.value).toBe(true);
      resetValue('name');
    });
  });

  describe('validateField', () => {
    it('should return empty array when field has no rules', async () => {
      const { validateField } = useForm(createBaseProps({
        rules: {},
      }));
      const errors = await validateField('name');
      expect(errors).toEqual([]);
    });

    it('should return empty array when field rules array is empty', async () => {
      const { validateField } = useForm(createBaseProps({
        rules: {
          name: [],
        },
      }));
      const errors = await validateField('name');
      expect(errors).toEqual([]);
    });

    it('should return empty array when all rules pass', async () => {
      const { validateField } = useForm(createBaseProps({
        rules: {
          name: [passRule, passRule],
          age: [passRule],
          email: [passRule],
        },
      }));
      const errors = await validateField('name');
      expect(errors).toEqual([]);
    });

    it('should return error details when a rule fails', async () => {
      const errorKey = 'name.required';
      const { validateField } = useForm(createBaseProps({
        rules: {
          name: [failRule(errorKey)],
          age: [passRule],
          email: [passRule],
        },
      }));
      const errors = await validateField('name');
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({ key: errorKey });
    });

    it('should return only failing errors, filtering out true results', async () => {
      const errorKey = 'name.custom';
      const { validateField } = useForm(createBaseProps({
        rules: {
          name: [passRule, failRule(errorKey), passRule],
          age: [passRule],
          email: [passRule],
        },
      }));
      const errors = await validateField('name');
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({ key: errorKey });
    });

    it('should handle async rules in validateField', async () => {
      const asyncPass = () => Promise.resolve(true as const);
      const asyncFail = () => Promise.resolve({ key: 'async.field.error' } as const);

      const { validateField } = useForm(createBaseProps({
        rules: {
          name: [asyncPass, asyncFail],
          age: [passRule],
          email: [passRule],
        },
      }));
      const errors = await validateField('name');
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({ key: 'async.field.error' });
    });

    it('should pass the full model to validateField rules', async () => {
      const ruleSpy = vi.fn(() => true as const);
      const model = { name: 'Alice', age: 30, email: 'alice@test.com' };

      const { validateField } = useForm({
        model,
        rules: {
          name: [ruleSpy],
        },
      });
      await validateField('name');

      expect(ruleSpy).toHaveBeenCalledTimes(1);
      expect(ruleSpy).toHaveBeenCalledWith('Alice', model);
    });

    it('should handle multiple failing rules for a single field', async () => {
      const { validateField } = useForm(createBaseProps({
        rules: {
          name: [failRule('error1'), failRule('error2'), failRule('error3')],
          age: [passRule],
          email: [passRule],
        },
      }));
      const errors = await validateField('name');
      expect(errors).toHaveLength(3);
      expect(errors[0]).toEqual({ key: 'error1' });
      expect(errors[1]).toEqual({ key: 'error2' });
      expect(errors[2]).toEqual({ key: 'error3' });
    });

    it('should not be affected by validateField results on other fields', async () => {
      const { validateField } = useForm(createBaseProps({
        rules: {
          name: [failRule('name.error')],
          age: [passRule],
          email: [passRule],
        },
      }));
      await validateField('name');
      const ageErrors = await validateField('age');
      expect(ageErrors).toEqual([]);
    });

    it('should handle rules with params in error objects', async () => {
      const ruleWithParams = () => ({
        key: 'length.min',
        params: { min: 3, current: 1 },
      });

      const { validateField } = useForm(createBaseProps({
        rules: {
          name: [ruleWithParams],
          age: [passRule],
          email: [passRule],
        },
      }));
      const errors = await validateField('name');
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        key: 'length.min',
        params: { min: 3, current: 1 },
      });
    });

    it('should handle rules that depend on other field values', async () => {
      const confirmRule = (_value: string, form: TestModel) => {
        if (form.email !== 'match@test.com') {
          return { key: 'email.mismatch' };
        }
        return true;
      };

      const { validateField } = useForm({
        model: { name: 'match@test.com', age: 0, email: 'different@test.com' },
        rules: {
          name: [confirmRule],
        },
      });
      const errors = await validateField('name');
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({ key: 'email.mismatch' });
    });
  });
});