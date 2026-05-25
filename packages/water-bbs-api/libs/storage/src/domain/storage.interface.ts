import { Inject } from '@nestjs/common';
import { FileReference } from 'water-bbs-migration';
import { InfrastructureError, Result } from 'water-bbs-shared';

export const STORAGE_ENGINE_KEY = Symbol('STORAGE.ENGINE');
export const InjectStoreEngine = () => Inject(STORAGE_ENGINE_KEY);

export interface StorageEngine {
  support(fileRef: FileReference): boolean;
  valid(val: string): boolean;
  put(
    file: Buffer,
    mimeType: string,
    fileName: string,
    size: number,
  ): Promise<Result<FileReference, InfrastructureError>>;
  remove(file: FileReference): Promise<Result<boolean, InfrastructureError>>;
  load(
    file: FileReference,
  ): Promise<Result<Buffer | null, InfrastructureError>>;
}
