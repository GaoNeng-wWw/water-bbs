import { UiDrawerContent } from '@/components/ui';
import { h, markRaw, reactive, type Component } from 'vue';

export type DrawerRenderReturn<T> = {
  data: T;
};

export type DrawerResolve<T = any> = (value: DrawerRenderReturn<T>) => void;

export type Drawer = {
  id: number;
  comp: Component;
  show: boolean;
  _data?: any;
  resolve: DrawerResolve;
  direction?: 'bottom' | 'top' | 'left' | 'right';
  snapPoints: (string | number)[];
  activeSnapPoints?: (string | number | null);
};

export type RenderOptions = {
  direction?: 'bottom' | 'top' | 'left' | 'right';
  snapPoints?: (string | number)[];
};

const drawer: Drawer[] = reactive([]);

let cnt = 0;

export const useDrawer = () => {
  const render = (
    content: Component,
    opts: RenderOptions = { direction: 'bottom' },
  ) => {
    const comp = h(content);
    let resolveFn;
    const p = new Promise((resolve) => {
      resolveFn = resolve;
    });
    drawer.push({
      id: ++cnt,
      comp: markRaw(comp),
      show: true,
      resolve: resolveFn!,
      direction: opts.direction ?? 'bottom',
      snapPoints: opts.snapPoints ?? [],
      activeSnapPoints: opts.snapPoints ? opts.snapPoints[0] : undefined,
    });
    return p;
  };
  const close = (id: number, data?: any) => {
    const idx = drawer.findIndex(d => d.id === id);
    if (idx === -1) {
      return;
    }
    const d = drawer[idx];
    d._data = data;
    d.show = false;
    d.resolve({ data: d._data });
  };
  const onExit = (id: number) => {
    const idx = drawer.findIndex(d => d.id === id);
    if (idx === -1) {
      return;
    }
    const [dialog] = drawer.splice(idx, 1);
    dialog.resolve(dialog._data);
  };

  return { render, close, onExit, drawer };
};
