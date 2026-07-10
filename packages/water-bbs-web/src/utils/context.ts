import { inject, provide, warn, type InjectionKey } from 'vue';

export const getContext = <T>(key: InjectionKey<T>) => {
  const ctx = inject(key);
  if (!ctx) {
    warn(
      `injection "${String(key.description || key.toString())}" not found. `
      + 'Please check if the corresponding provide() is active in an ancestor component.',
    );
  }
  return ctx!;
};
export const provideContext = <T>(key: InjectionKey<T>, ctx: T) => {
  provide(key, ctx);
};