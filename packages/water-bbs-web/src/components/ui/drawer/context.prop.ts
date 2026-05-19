import type { InjectionKey } from 'vue';

export const drawerContextKey: InjectionKey<DrawerContext> = Symbol('drawer.context');
export type DrawerContext = {
  hasParent: boolean;
};
