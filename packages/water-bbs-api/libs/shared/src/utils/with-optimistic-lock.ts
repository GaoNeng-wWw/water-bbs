import { err, InfrastructureError, ok } from 'water-bbs-shared';

interface OptimisticLockConfig {
  maxRetries?: number;
  baseDelayMs?: number;
}

export interface WithOptimisticLockCallback<
  Source,
  BeforeModifyReturn,
  Version,
  NewVersion,
  BeforeSetVersionEntity,
> {
  readonly load: () => Promise<Source | null>;
  readonly modify: (
    entity: Source,
  ) => Promise<BeforeModifyReturn> | BeforeModifyReturn;
  readonly save: (
    oldVersion: Version,
    entity: BeforeModifyReturn,
  ) => Promise<NewVersion | null>;
  readonly getVersion: (cur: Source) => Version;
  readonly setVersion: (
    cur: BeforeModifyReturn,
    version: NewVersion,
  ) => BeforeSetVersionEntity;
}

export const withOptimisticLock = async <
  Source,
  BeforeModifyReturn,
  Version,
  NewVersion,
  BeforeSetVersionEntity,
>(
  {
    load,
    modify,
    save,
    getVersion,
    setVersion,
  }: WithOptimisticLockCallback<
    Source,
    BeforeModifyReturn,
    Version,
    NewVersion,
    BeforeSetVersionEntity
  >,
  config: OptimisticLockConfig = {},
) => {
  const maxRetries = config.maxRetries || 10;
  const baseDelayMs = config.baseDelayMs || 100;
  let attempt = 0;
  while (attempt < maxRetries) {
    const cur = await load();
    if (!cur) {
      return err(new InfrastructureError('CAN_NOT_LOAD_ENTRY'));
    }
    const version = getVersion(cur);
    const newEntity = await modify(cur);
    const newVersion = await save(version, newEntity);
    if (!newVersion) {
      attempt += 1;
      // 指数退让
      const delay = Math.min(Math.random() * baseDelayMs * 2 ** attempt, 2000);
      await new Promise<true>((resolve) => {
        return setTimeout(() => {
          resolve(true);
        }, delay);
      });
      continue;
    }
    return ok(setVersion(newEntity, newVersion));
  }
  return err(new InfrastructureError('OPTIMISTIC_LOCK_CONFLICT', null));
};
