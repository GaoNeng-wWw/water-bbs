import Joi from 'joi';
import { yaml } from './loader';
import {
  DatabaseConfigure,
  databaseConfigValidatorSchema,
} from './configure/database.configure';
import { RedisConfigure } from './configure/redis.configure';

export type Configure = {
  database: DatabaseConfigure;
  redis: RedisConfigure;
};

export const configureSchema = Joi.object<Configure>({
  database: databaseConfigValidatorSchema,
});

export { yaml };

export * from './configure/database.configure';
export * from './configure/redis.configure';
