import { useAccount } from '@/store';
import type { Directive } from 'vue';
export type El = HTMLElement & { __RAW_STYLE__: Record<string, any> };

export const vPermission: Directive<El, string> = {
  beforeMount(el) {
    const element = el as El;
    element.__RAW_STYLE__ = { ...element.style };
    element.style.display = 'none';
  },
  mounted(el, binding) {
    const store = useAccount();
    const element = el as El;
    const { value } = binding;
    if (!store.hasPermission(value)) {
      return;
    }
    element.style.display = element.__RAW_STYLE__.display;
  },
};
