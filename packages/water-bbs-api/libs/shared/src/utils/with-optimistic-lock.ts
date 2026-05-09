import {
  err,
  isErr,
  isOk,
  ok,
  PersistenceError,
  Result,
} from 'water-bbs-shared';

interface OptimisticLockConfig {
  maxRetries?: number;
  baseDelayMs?: number;
}

interface OptimisticLockCallbacks<T, V> {
  load: () => Promise<Result<T, Error>>;
  modify: (entity: T) => Promise<Result<T, Error>> | Result<T, Error>;
  save: (
    entity: T,
    oldVersion: V,
  ) => Promise<Result<V, OptimisticLockConflict>>;
  getVersion: (entity: T) => V;
  setVersion: (entity: T, newVersion: V) => T;
}

export class CanNotLoadEntry extends PersistenceError {
  constructor(reason: Error | null, args: Record<string, any>) {
    super(reason, args);
    this.message = 'CAN_NOT_LOAD_ENTRY';
  }
}

export class OptimisticLockConflict extends PersistenceError {
  constructor(reason: Error | null, args: Record<string, any>) {
    super(reason, args);
    this.message = 'OPTIMISTIC_LOCK_CONFLICT';
  }
}

export class Unexcept extends PersistenceError {
  constructor(reason: Error | null, args: Record<string, any>) {
    super(reason, args);
    this.message = 'UNEXCEPT';
  }
}

export async function withOptimisticLock<T, V>(
  callbacks: OptimisticLockCallbacks<T, V>,
  config?: OptimisticLockConfig,
): Promise<Result<T, OptimisticLockConflict>> {
  const maxRetries = config?.maxRetries ?? 10;
  const baseDelay = config?.baseDelayMs ?? 100;
  let attempt = 0;

  while (attempt < maxRetries) {
    const loadResult = await callbacks.load();
    if (isErr(loadResult)) {
      return err(new CanNotLoadEntry(null, {}));
    }
    const entity = loadResult.value;
    const oldVersion = callbacks.getVersion(entity);

    const modifyResult = await callbacks.modify(entity);
    if (isErr(modifyResult)) {
      return err(new Unexcept(modifyResult.error, {}));
    }
    const newEntity = modifyResult.value;

    const saveResult = await callbacks.save(newEntity, oldVersion);
    if (isOk(saveResult)) {
      const finalEntity = callbacks.setVersion(newEntity, saveResult.value);
      return ok(finalEntity);
    }
    // 冲突时重试
    if (saveResult.error instanceof OptimisticLockConflict) {
      attempt++;
      const delay = Math.min(
        baseDelay * 2 ** attempt + Math.random() * 100,
        2000,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }
    // 其他保存错误直接失败
    return err(saveResult.error);
  }
  return err(new OptimisticLockConflict(null, { retries: maxRetries }));
}
