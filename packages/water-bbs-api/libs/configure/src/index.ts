import Joi from 'joi';
import { yaml } from './loader';
import {
  DatabaseConfigure,
  databaseConfigValidatorSchema,
} from './configure/database.configure';
import { redisConfigSchema, RedisConfigure } from './configure/redis.configure';
import {
  Storage,
  storageConfigValidatorSchema,
} from './configure/storage.configure';

export type Configure = {
  database: DatabaseConfigure;
  redis: RedisConfigure;
  storage: Storage;
  basePath: string;
};

export const configureSchema = Joi.object<Configure>({
  database: databaseConfigValidatorSchema,
  redis: redisConfigSchema,
  storage: storageConfigValidatorSchema,
  basePath: Joi.string().required(),
});

export { yaml };

export * from './configure/database.configure';
export * from './configure/redis.configure';
export * from './configure/storage.configure';
