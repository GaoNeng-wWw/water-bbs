export type Callback<Args, Response> = (args: Args) => Response;
export const useEventBus = <Args, Response>() => {
  const records = new Map<string, Callback<Args, Response>[]>();

  const on = (name: string, callback: Callback<Args, Response>) => {
    records.has(name) ? records.get(name)?.push(callback) : records.set(name, [callback]);
  };
  const emit = (name: string, args: Args) => {
    (records.get(name) ?? []).forEach(cb => cb(args));
  };
  const clear = () => records.clear();
  const remove = (name: string) => records.delete(name);
  const off = (name: string, fn: Callback<Args, Response>) => {
    const idx = records.get(name)?.indexOf(fn) ?? -1;
    (records.get(name) ?? []).splice(idx, 1);
  };
  return { on, emit, off, clear, remove };
};
