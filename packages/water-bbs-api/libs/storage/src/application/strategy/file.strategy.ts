import { ApplicationError } from '@app/shared';
import { err, ok, Result } from 'neverthrow';
import { StorageEntity, StorageKey, toStorageKey } from '../../storage.entity';
import { IStorage, ReadResponse } from './storage.interface';
import { createHash } from 'crypto';
import { EntityManager } from '@mikro-orm/sqlite';
import { v7 } from 'uuid';
import { ConfigureService } from '@app/configure';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import { ExpectTypeError, StorageNotFound } from '../error';
import { Injectable } from '@nestjs/common';
import { InjectStorageConfig, type StorageConfig } from '../../constant';

@Injectable()
export class FileStrategy implements IStorage<Express.Multer.File, Buffer> {
  constructor(
    private readonly em: EntityManager,
    private readonly cfg: ConfigureService,
    @InjectStorageConfig()
    private readonly config: StorageConfig,
  ) {}
  async read(
    key: StorageKey,
  ): Promise<Result<ReadResponse<Buffer<ArrayBufferLike>>, ApplicationError>> {
    const meta = await this.meta(key);
    if (meta.isErr()) {
      return err(meta.error);
    }
    const id = meta.value.key;
    const storage = this.cfg.get('storage');
    if (storage.kind !== 'disk') {
      return err(new ExpectTypeError('disk', storage.kind));
    }
    const path = this.config.id;
    const payload = readFileSync(join(__dirname, path, id));

    return ok({
      mimetype: meta.value.mimetype,
      size: meta.value.size,
      payload,
    });
  }
  async put(
    payload: Express.Multer.File,
  ): Promise<Result<StorageEntity, ApplicationError>> {
    const hasher = createHash('sha256');
    const hash = hasher.update(payload.buffer).digest('hex');
    const mimetype = payload.mimetype;
    const storage = this.cfg.get('storage');
    if (storage.kind !== 'disk') {
      return err(new ExpectTypeError('disk', storage.kind));
    }
    const path = this.config.id;
    const key = toStorageKey(v7());
    const root = join(__dirname, path);
    if (!existsSync(root)) {
      mkdirSync(root);
    }
    writeFileSync(join(__dirname, path, key), payload.buffer);
    const storageEntity = this.em.create(StorageEntity, {
      key,
      mimetype,
      size: payload.size,
      hash,
    });
    this.em.persist(storageEntity);
    await this.em.flush();
    return ok(storageEntity);
  }
  async remove(
    key: StorageKey,
  ): Promise<Result<StorageEntity, ApplicationError>> {
    const storage = await this.em.findOne(StorageEntity, { key });
    if (!storage) {
      return err(new StorageNotFound());
    }
    const storageCfg = this.cfg.get('storage');
    if (storageCfg.kind !== 'disk') {
      return err(new ExpectTypeError('disk', storageCfg.kind));
    }
    const path = this.config.id;
    const id = storage.key;
    storage._remove();
    await this.em.transactional(async (tx) => {
      unlinkSync(join(__dirname, path, id));
      tx.persist(storage);
      await tx.flush();
    });
    return ok(storage);
  }
  async meta(
    key: StorageKey,
  ): Promise<Result<StorageEntity, ApplicationError>> {
    const entity = await this.em.findOne(StorageEntity, { key });
    if (!entity) {
      return err(new StorageNotFound());
    }
    return ok(entity);
  }
}
