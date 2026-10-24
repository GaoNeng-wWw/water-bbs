import { Result } from 'neverthrow';
import { StorageEntity, StorageKey } from '../../storage.entity';
import { ApplicationError } from '@app/shared';

export type ReadResponse<P> = {
  mimetype: string;
  size: number;
  payload: P;
};

export interface IStorage<PutPayload, ReadPayload> {
  put(payload: PutPayload): Promise<Result<StorageEntity, ApplicationError>>;
  remove(key: StorageKey): Promise<Result<StorageEntity, ApplicationError>>;
  meta(key: StorageKey): Promise<Result<StorageEntity, ApplicationError>>;
  read(
    key: StorageKey,
  ): Promise<Result<ReadResponse<ReadPayload>, ApplicationError>>;
}
