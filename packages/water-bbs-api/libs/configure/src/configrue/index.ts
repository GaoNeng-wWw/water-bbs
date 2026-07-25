import Joi from 'joi';
import { Database, databaseSchema } from './database';
import { RedisConfig, redisSchema } from './redis';

export type Configure = {
  database: Database;
  redis: RedisConfig;
};

export const schema = Joi.object({
  database: databaseSchema,
  redis: redisSchema
});
