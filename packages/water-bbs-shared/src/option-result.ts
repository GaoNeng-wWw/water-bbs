export const OK_SYMBOL = Symbol('OK');
export const ERR_SYMBOL = Symbol('ERR');
export const SOME_SYMBOL = Symbol('SOME');
export const NONE_SYMBOL = Symbol('NONE');
export type Ok<T> = { __tag: typeof OK_SYMBOL; value: T };
export type Err<E> = { __tag: typeof ERR_SYMBOL; error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export type Some<T> = { _tag: typeof SOME_SYMBOL; value: T };
export type None = { _tag: typeof NONE_SYMBOL };
export type Option<T> = Some<T> | None;

export const some = <T>(value: T): Option<T> => ({ _tag: SOME_SYMBOL, value });
export const none: None = { _tag: NONE_SYMBOL };

export const isSome = <T>(opt: Option<T>): opt is Some<T> => opt._tag === SOME_SYMBOL;
export const isNone = <T>(opt: Option<T>): opt is None => opt._tag === NONE_SYMBOL;

export const isErr = <T, E>(res: Result<T, E>): res is Err<E> => {
  return res.__tag === ERR_SYMBOL;
};
export const isOk = <T, E>(res: Result<T, E>): res is Ok<T> => {
  return res.__tag === OK_SYMBOL;
};
export const ok = <T>(value: T): Ok<T> => {
  return { __tag: OK_SYMBOL, value };
};
export const err = <E>(err: E): Err<E> => {
  return { __tag: ERR_SYMBOL, error: err };
};

export const unwrapOption = <T>(opt: Option<T>, msg?: string): T => {
  if (isNone(opt)) {
    throw new Error(msg ?? 'called `unwrapOption` on a `None` value');
  }
  return opt.value;
};

export const expectOption = <T>(opt: Option<T>, msg: string): T => unwrapOption(opt, msg);

export const unwrapOr = <T>(opt: Option<T>, defaultValue: T): T =>
  isSome(opt) ? opt.value : defaultValue;

export const unwrapOrElse = <T>(opt: Option<T>, fn: () => T): T =>
  isSome(opt) ? opt.value : fn();

// --- 变换与组合 ---
export const mapOption = <T, U>(opt: Option<T>, fn: (value: T) => U): Option<U> =>
  isSome(opt) ? some(fn(opt.value)) : none;

export const andThenOption = <T, U>(opt: Option<T>, fn: (value: T) => Option<U>): Option<U> =>
  isSome(opt) ? fn(opt.value) : none;

export const filterOption = <T>(opt: Option<T>, predicate: (value: T) => boolean): Option<T> =>
  isSome(opt) && predicate(opt.value) ? opt : none;

export const orOption = <T>(opt: Option<T>, other: Option<T>): Option<T> =>
  isSome(opt) ? opt : other;

export const orElseOption = <T>(opt: Option<T>, fn: () => Option<T>): Option<T> =>
  isSome(opt) ? opt : fn();

export const zipOption = <T, U>(opt: Option<T>, other: Option<U>): Option<[T, U]> =>
  isSome(opt) && isSome(other) ? some([opt.value, other.value]) : none;

export const andOption = <T, U>(opt: Option<T>, other: Option<U>): Option<U> =>
  isSome(opt) ? other : none;

// --- 转换成 Result ---
export const okOr = <T, E>(opt: Option<T>, error: E): Result<T, E> =>
  isSome(opt) ? ok(opt.value) : err(error);

export const okOrElse = <T, E>(opt: Option<T>, fn: () => E): Result<T, E> =>
  isSome(opt) ? ok(opt.value) : err(fn());

// --- 模式匹配 ---
export const matchOption = <T, U>(
  opt: Option<T>,
  onSome: (value: T) => U,
  onNone: () => U,
): U => (isSome(opt) ? onSome(opt.value) : onNone());

export const unwrapResult = <T, E>(res: Result<T, E>, msg?: string): T => {
  if (isErr(res)) {
    throw new Error(msg ?? 'called `unwrapResult` on an `Err` value');
  }
  return res.value;
};

export const expectResult = <T, E>(res: Result<T, E>, msg: string): T =>
  unwrapResult(res, msg);

export const unwrapErr = <T, E>(res: Result<T, E>, msg?: string): E => {
  if (isOk(res)) {
    throw new Error(msg ?? 'called `unwrapErr` on an `Ok` value');
  }
  return res.error;
};

export const expectErr = <T, E>(res: Result<T, E>, msg: string): E =>
  unwrapErr(res, msg);

export const unwrapOrResult = <T, E>(res: Result<T, E>, defaultValue: T): T =>
  isOk(res) ? res.value : defaultValue;

export const unwrapOrElseResult = <T, E>(res: Result<T, E>, fn: (err: E) => T): T =>
  isOk(res) ? res.value : fn(res.error);

// --- 变换与组合 ---
const mapResult = <T, E, U>(res: Result<T, E>, fn: (value: T) => U): Result<U, E> =>
  isOk(res) ? ok(fn(res.value)) : res;

export const mapErr = <T, E, F>(res: Result<T, E>, fn: (error: E) => F): Result<T, F> =>
  isErr(res) ? err(fn(res.error)) : res;

export const andThenResult = <T, E, U>(
  res: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => (isOk(res) ? fn(res.value) : res);

const orResult = <T, E>(res: Result<T, E>, other: Result<T, E>): Result<T, E> =>
  isOk(res) ? res : other;

export const orElseResult = <T, E>(
  res: Result<T, E>,
  fn: (error: E) => Result<T, E>,
): Result<T, E> => (isOk(res) ? res : fn(res.error));

// --- 转换成 Option ---
export const okToOption = <T, E>(res: Result<T, E>): Option<T> =>
  isOk(res) ? some(res.value) : none;

export const errToOption = <T, E>(res: Result<T, E>): Option<E> =>
  isErr(res) ? some(res.error) : none;

// --- 模式匹配 ---
export const matchResult = <T, E, U>(
  res: Result<T, E>,
  onOk: (value: T) => U,
  onErr: (error: E) => U,
): U => (isOk(res) ? onOk(res.value) : onErr(res.error));

interface PipeOption<T> {
  isSome: () => this is Some<T>;
  isNone: () => this is None;
  map: <U>(fn: (value: T) => U) => PipeOption<U>;
  andThen: <U>(fn: (value: T) => Option<U>) => PipeOption<U>;
  filter: (predicate: (value: T) => boolean) => PipeOption<T>;
  okOr: <E>(error: E) => Result<T, E>;
  okOrElse: <E>(fn: () => E) => Result<T, E>;
  or: (other: Option<T>) => PipeOption<T>;
  orElse: (fn: () => Option<T>) => PipeOption<T>;
  zip: <U>(other: Option<U>) => PipeOption<[T, U]>;
  and: <U>(other: Option<U>) => PipeOption<U>;
  unwrap: (msg?: string) => T;
  expect: (msg: string) => T;
  unwrapOr: (defaultValue: T) => T;
  unwrapOrElse: (fn: () => T) => T;
  match: <U>(onSome: (value: T) => U, onNone: () => U) => U;
}

interface PipeResult<T, E> {
  isOk: () => this is Ok<T>;
  isErr: () => this is Err<E>;
  map: <U>(fn: (value: T) => U) => PipeResult<U, E>;
  mapErr: <F>(fn: (error: E) => F) => PipeResult<T, F>;
  andThen: <U>(fn: (value: T) => Result<U, E>) => PipeResult<U, E>;
  or: (other: Result<T, E>) => PipeResult<T, E>;
  orElse: (fn: (error: E) => Result<T, E>) => PipeResult<T, E>;
  ok: () => Option<T>;
  err: () => Option<E>;
  unwrap: (msg?: string) => T;
  expect: (msg: string) => T;
  unwrapErr: (msg?: string) => E;
  expectErr: (msg: string) => E;
  unwrapOr: (defaultValue: T) => T;
  unwrapOrElse: (fn: (error: E) => T) => T;
  match: <U>(onOk: (value: T) => U, onErr: (error: E) => U) => U;
}

export const pipeOption = <T>(opt: Option<T>): PipeOption<T> => ({
  isSome: (): this is Some<T> => isSome(opt),
  isNone: (): this is None => isNone(opt),
  map: <U>(fn: (value: T) => U) => pipeOption(mapOption(opt, fn)),
  andThen: <U>(fn: (value: T) => Option<U>) => pipeOption(andThenOption(opt, fn)),
  filter: (predicate: (value: T) => boolean) => pipeOption(filterOption(opt, predicate)),
  okOr: <E>(error: E) => okOr(opt, error),
  okOrElse: <E>(fn: () => E) => okOrElse(opt, fn),
  or: (other: Option<T>) => pipeOption(orOption(opt, other)),
  orElse: (fn: () => Option<T>) => pipeOption(orElseOption(opt, fn)),
  zip: <U>(other: Option<U>) => pipeOption(zipOption(opt, other)),
  and: <U>(other: Option<U>) => pipeOption(andOption(opt, other)),
  unwrap: (msg?: string) => unwrapOption(opt, msg),
  expect: (msg: string) => expectOption(opt, msg),
  unwrapOr: (defaultValue: T) => unwrapOr(opt, defaultValue),
  unwrapOrElse: (fn: () => T) => unwrapOrElse(opt, fn),
  match: <U>(onSome: (value: T) => U, onNone: () => U) => matchOption(opt, onSome, onNone),
});
export const pipeResult = <T, E>(res: Result<T, E>): PipeResult<T, E> => ({
  isOk: (): this is Ok<T> => isOk(res),
  isErr: (): this is Err<E> => isErr(res),
  map: <U>(fn: (value: T) => U) => pipeResult(mapResult(res, fn)),
  mapErr: <F>(fn: (error: E) => F) => pipeResult(mapErr(res, fn)),
  andThen: <U>(fn: (value: T) => Result<U, E>) => pipeResult(andThenResult(res, fn)),
  or: (other: Result<T, E>) => pipeResult(orResult(res, other)),
  orElse: (fn: (error: E) => Result<T, E>) => pipeResult(orElseResult(res, fn)),
  ok: () => okToOption(res),
  err: () => errToOption(res),
  unwrap: (msg?: string) => unwrapResult(res, msg),
  expect: (msg: string) => expectResult(res, msg),
  unwrapErr: (msg?: string) => unwrapErr(res, msg),
  expectErr: (msg: string) => expectErr(res, msg),
  unwrapOr: (defaultValue: T) => unwrapOrResult(res, defaultValue),
  unwrapOrElse: (fn: (error: E) => T) => unwrapOrElseResult(res, fn),
  match: <U>(onOk: (value: T) => U, onErr: (error: E) => U) => matchResult(res, onOk, onErr),
});
