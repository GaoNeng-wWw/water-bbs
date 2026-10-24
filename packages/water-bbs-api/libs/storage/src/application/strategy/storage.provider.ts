import { Inject } from '@nestjs/common';
import { Buffer } from 'buffer';
import { IStorage } from './storage.interface';

export type Storage<I = Express.Multer.File, O = Buffer> = IStorage<I, O>;

export const StorageProvider = Symbol('IStorage');
export const InjectStorage = () => Inject(StorageProvider);
