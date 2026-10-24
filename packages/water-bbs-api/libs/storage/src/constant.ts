import { Inject } from '@nestjs/common';

export interface StorageConfig {
  id: string;
}

export const STORAGE_CONFIG_KEY = Symbol('STORAGE_CONFIG_KEY');
export const InjectStorageConfig = () => Inject(STORAGE_CONFIG_KEY);
