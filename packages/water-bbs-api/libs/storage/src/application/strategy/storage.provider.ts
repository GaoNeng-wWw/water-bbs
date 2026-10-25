import { Inject } from '@nestjs/common';
import { Buffer } from 'buffer';
import { IStorage } from './storage.interface';

export type Storage<I = Express.Multer.File, O = Buffer> = IStorage<I, O>;

export const StorageProvider = Symbol('IStorage');

export const storageProviderOf = (id?: string) =>
  id ? Symbol.for(`IStorage:${id}`) : StorageProvider;

export const InjectStorage = (id?: string) => Inject(storageProviderOf(id));