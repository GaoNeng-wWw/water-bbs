import { MetaEntity } from '@app/shared';
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';

export type StorageKey = string & { readonly __brand: unique symbol };
export type StorageId = string & { readonly __brand: unique symbol };

export const toStorageKey = (key: string): StorageKey => key as StorageKey;
export const createStorageId = (): StorageId => v7() as StorageId;

@Entity()
export class StorageEntity extends MetaEntity {
  @PrimaryKey({
    type: 'uuid',
    onCreate: createStorageId,
  })
  id: StorageId;
  @Index()
  @Property({ type: 'string' })
  key: StorageKey;
  @Property({ type: 'string' })
  mimetype: string;
  @Property({ type: 'integer' })
  size: number;
  @Property({ type: 'string' })
  @Index()
  hash: string;
}
