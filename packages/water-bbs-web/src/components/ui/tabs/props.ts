import { createContext } from '@/composables';
import type { ComputedRef, VNode } from 'vue';

export type TabsContext = {
  active: ComputedRef<string | null>;
  onMounted: (id: string, label: string, slot: () => VNode[], disabled: boolean) => void;
};

export type TabsProps = {
  defaultActvie?: string;
  disabled?: string[];
  lazy?: boolean;
};

export type TabRootEmits = {
  active: [string];
};

export type TabItemProps = {
  id: string;
  label: string;
  disabled?: boolean;
};

export const [provideContext, useContext] = createContext<TabsContext>('tab');