export type NonFunctionKeys<T> = keyof {
  [K in keyof T as T[K] extends (...args: any) => any ? never : K]: any;
};
