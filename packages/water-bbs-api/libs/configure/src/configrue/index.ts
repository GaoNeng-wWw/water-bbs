import Joi from 'joi';
import { Database, databaseSchema } from './database';
import { RedisConfig, redisSchema } from './redis';
import { MailConfigure, MailSchema } from './mail';
import { Feature, FeatureSchema } from './feature';
import { TokenConfigure, tokenSchema } from './token';

export type Configure = {
  database: Database;
  redis: RedisConfig;
  mail: MailConfigure;
  feature: Feature;
  token: TokenConfigure;
};

export const schema = Joi.object({
  database: databaseSchema,
  redis: redisSchema,
  mail: MailSchema,
  feature: FeatureSchema,
  token: tokenSchema,
});
