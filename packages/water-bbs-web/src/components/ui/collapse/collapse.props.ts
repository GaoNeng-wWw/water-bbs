import type { ComputedRef, InjectionKey } from 'vue';

export type CollapseProps = {
  according?: boolean;
};
export type CollapseItemProp = {
  label?: string;
  id: string;
};
export type CollapseContext = {
  according: ComputedRef<boolean>;
  currentActive: ComputedRef<string[]>;
  setActive: (key: string) => void;
};
export const CollapseContextKey: InjectionKey<CollapseContext> = Symbol('collapse.root');
