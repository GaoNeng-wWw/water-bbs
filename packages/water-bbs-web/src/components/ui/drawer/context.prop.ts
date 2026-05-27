import type { ComputedRef, InjectionKey } from 'vue';

export const drawerContextKey: InjectionKey<DrawerContext> = Symbol('drawer.context');
export type DrawerContext = {
  hasParent: boolean;
  direction: ComputedRef<Direction>;
  setDirection: (dir: Direction) => void;
};
export type Direction = 'left' | 'right' | 'top' | 'bottom';
export type DrawerProps = {
  direction?: Direction;
  snapPoints?: (string | number)[];
};
