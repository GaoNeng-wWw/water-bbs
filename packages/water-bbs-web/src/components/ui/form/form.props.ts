import { createContext } from '@/composables';
import type { ComputedRef } from 'vue';

export type FormProps<Schema> = {
  schema?: Schema;
  model?: Record<string, any>;
  labelPosition?: 'top' | 'left';
  triggerMethod?: 'change' | 'submit';
};

export type FormContext = {
  labelPosition: ComputedRef<'top' | 'left'>;
  triggerMethod: ComputedRef<'change' | 'submit'>;
};

export const [FormProvider, useFormContext] = createContext<FormContext>('form');
