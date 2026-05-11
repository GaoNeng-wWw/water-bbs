import type { ComputedRef, InjectionKey } from 'vue';

export type FormContext = {
  validateMode: ComputedRef<'change' | 'blur' | 'custom'>;
};

export const FORM_CONTEXT_KEY: InjectionKey<FormContext> = Symbol('form.context');
