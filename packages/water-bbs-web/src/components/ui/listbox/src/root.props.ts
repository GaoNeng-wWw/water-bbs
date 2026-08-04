import type { ComputedRef, InjectionKey } from 'vue';

export type SelectionMode = 'none' | 'single' | 'multiple';

export type ListBoxRootProps = {
  mode?: SelectionMode;
  defaultSelected?: string[];
  disabledKey?: string[];
};

export type RootContext = {
  selectedKey: ComputedRef<string[]>;
  disabledKey: ComputedRef<string[]>;
  onSelect: (key: string, value: string) => void;
};

export type ListBoxItem = { id: string; value: string };

export type RootEmits = {
  select: [ListBoxItem];
};

export const ListBoxContextKey: InjectionKey<RootContext> = Symbol('list-bos.root');
