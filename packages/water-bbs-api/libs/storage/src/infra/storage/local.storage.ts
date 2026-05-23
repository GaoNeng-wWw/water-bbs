import { Configure, Storage } from '@app/configure';
import { StorageEngine } from '@app/storage/domain';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import { FileReference } from 'water-bbs-migration';
import { Result, InfrastructureError, ok } from 'water-bbs-shared';

@Injectable()
export class LocalStorage implements StorageEngine {
  constructor(private config: ConfigService<Configure, true>) {}
  support(fileRef: FileReference): boolean {
    return fileRef.storageType === 'local';
  }
  put(
    file: Buffer,
    mimeType: string,
    fileName: string,
    size: number,
  ): Promise<Result<FileReference, InfrastructureError>> {
    const hash = createHash('sha512').update(file).digest().toString('hex');
    const fileReference = new FileReference(
      hash,
      fileName,
      size,
      mimeType,
      'local',
    );
    const storage = this.config.get<Storage>('storage');
    const fullPath = join(__dirname, storage.path);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath);
    }
    writeFileSync(join(fullPath, `${hash}.$ `), file);
    return Promise.resolve(ok(fileReference));
  }
  remove(file: FileReference): Promise<Result<boolean, InfrastructureError>> {
    const hash = file.name;
    const storage = this.config.get<Storage>('storage');
    const fullPath = join(__dirname, storage.path, hash);
    if (!execSync(fullPath)) {
      return Promise.resolve(ok(true));
    }
    unlinkSync(fullPath);
    return Promise.resolve(ok(true));
  }
  load(
    file: FileReference,
  ): Promise<Result<Buffer | null, InfrastructureError>> {
    const hash = file.name;
    const storage = this.config.get<Storage>('storage');
    const fullPath = join(__dirname, storage.path, hash);
    if (!execSync(fullPath)) {
      return Promise.resolve(ok(null));
    }
    const buf = readFileSync(fullPath);
    return Promise.resolve(ok(buf));
  }
}
