import { markRaw, reactive, type Component } from 'vue';

export type RenderReturn<T> = {
  data: T;
};

export type Resolve<T = any> = (value: RenderReturn<T>) => void;
export type Dialog = {
  id: number;
  component: Component;
  props: Record<string, any>;
  resolve: Resolve;
  show: boolean;
  _data?: any;
};

let uid = 0;
const dialogs: Dialog[] = reactive([]);

export function useDialog() {
  function render<T>(component: Component, props?: Record<string, any>) {
    const id = ++uid;
    let resolveFunc!: Resolve<T>;

    const promise = new Promise<RenderReturn<T>>((resolve) => {
      resolveFunc = resolve;
    });

    const instance: Dialog = {
      id,
      component: markRaw(component),
      props: props ?? {},
      resolve: resolveFunc,
      show: true,
    };

    dialogs.push(instance);

    return promise;
  }
  function closeDialog(id: number, data?: any) {
    const index = dialogs.findIndex(d => d.id === id);
    if (index === -1) {
      return;
    }
    const dialog = dialogs[index];
    dialog._data = data;
    dialog.show = false;
    dialog.resolve({
      data,
    });
  }
  function onDialogExit(id: number) {
    const idx = dialogs.findIndex(d => d.id === id);
    if (idx === -1) {
      return;
    }
    const [dialog] = dialogs.splice(idx, 1);
    dialog.resolve(dialog._data);
  }

  function closeAll() {
    dialogs.forEach(d => closeDialog(d.id));
  }

  return { render, closeDialog, closeAll, dialogs, onDialogExit };
}
