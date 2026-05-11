import type { ComputedRef, InjectionKey } from 'vue';

export interface ItemContext {
  setValue: (value: unknown, shouldValidate?: boolean | undefined) => void;
  required?: ComputedRef<boolean>;
  name?: ComputedRef<string>;
}

export const ITEM_CONTEXT_KEY: InjectionKey<ItemContext> = Symbol('FORM.ITEM.CONTEXT');
