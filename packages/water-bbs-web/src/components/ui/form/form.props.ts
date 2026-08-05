import { createContext } from "@/composables";
import type { ComputedRef } from "vue";

export type FormProps<Schema> = {
  schema?: Schema;
  model?: Record<string, any>;
  labelPosition?: 'top' | 'left';
};

export type FormContext = {
  labelPosition: ComputedRef<'top' | 'left'>;
};

export const [FormProvider, useFormContext] = createContext<FormContext>('form');
