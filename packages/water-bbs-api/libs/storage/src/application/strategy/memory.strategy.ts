import { Injectable } from '@nestjs/common';
import { IStorage, ReadResponse } from './storage.interface';
import { ApplicationError } from '@app/shared';
import { err, ok, Result } from 'neverthrow';
import { createHash } from 'crypto';
import {
  StorageEntity,
  StorageId,
  StorageKey,
  toStorageKey,
} from '../../storage.entity';
import { v7 } from 'uuid';
import { StorageNotFound } from '../error';

type MemoryEntry = {
  entity: StorageEntity;
  payload: Buffer;
};

@Injectable()
export class MemoryStrategy implements IStorage<Express.Multer.File, Buffer> {
  private readonly store = new Map<StorageId, MemoryEntry>();

  async read(
    key: StorageKey,
  ): Promise<Result<ReadResponse<Buffer<ArrayBufferLike>>, ApplicationError>> {
    const meta = await this.meta(key);
    if (meta.isErr()) {
      return err(meta.error);
    }
    const entry = this.store.get(meta.value.id);
    if (!entry) {
      return err(new StorageNotFound());
    }
    return ok({
      mimetype: entry.entity.mimetype,
      size: entry.entity.size,
      payload: entry.payload,
    });
  }
  put(
    payload: Express.Multer.File,
  ): Promise<Result<StorageEntity, ApplicationError>> {
    const hasher = createHash('sha256');
    const hash = hasher.update(payload.buffer).digest('hex');
    const id = v7() as StorageId;
    const storageEntity = new StorageEntity();
    storageEntity.id = id;
    storageEntity.key = toStorageKey(v7());
    storageEntity.mimetype = payload.mimetype;
    storageEntity.size = payload.size;
    storageEntity.hash = hash;
    this.store.set(id, { entity: storageEntity, payload: payload.buffer });
    return Promise.resolve(ok(storageEntity));
  }
  async remove(
    key: StorageKey,
  ): Promise<Result<StorageEntity, ApplicationError>> {
    const storage = await this.meta(key);
    if (storage.isErr()) {
      return err(storage.error);
    }
    this.store.delete(storage.value.id);
    storage.value._remove();
    return ok(storage.value);
  }
  meta(key: StorageKey): Promise<Result<StorageEntity, ApplicationError>> {
    for (const entry of this.store.values()) {
      if (entry.entity.key === key) {
        return Promise.resolve(ok(entry.entity));
      }
    }
    return Promise.resolve(err(new StorageNotFound()));
  }
}
