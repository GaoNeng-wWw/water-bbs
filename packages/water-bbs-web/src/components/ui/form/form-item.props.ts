import { createContext } from '@/composables';
import type { ComputedRef } from 'vue';

export type FormItemContext = {
  invalid: ComputedRef<boolean>;
};

export const [FormItemProvider, injectFormItem] = createContext<FormItemContext>('form-item');
