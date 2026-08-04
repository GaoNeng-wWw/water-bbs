import { inject, provide, type InjectionKey } from 'vue';

export const createContext = <T>(componentName: string) => {
  const key: InjectionKey<T> = Symbol(`${componentName}Context`);
  const provideContext = (ctx: T) => {
    provide(key, ctx)!;
  };
  const useContext = () => {
    return inject(key)!;
  };
  return [provideContext, useContext] as const;
};
