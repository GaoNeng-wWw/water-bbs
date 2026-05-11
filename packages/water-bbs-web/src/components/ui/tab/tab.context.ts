import type { InjectionKey, DeepReadonly, ComputedRef, VNode, RendererElement, RendererNode } from 'vue';

export type TabItem = { key: string; label: string; component: VNode<RendererNode, RendererElement, { [key: string]: any }>[] | null };
export type TabContext = {
  items: DeepReadonly<ComputedRef<TabItem[]>>;
  register: (item: TabItem) => void;
  setActive: (id: string) => void;
};

export const CONTEXT_KEY: InjectionKey<TabContext> = Symbol('TAB.CONTEXT');
