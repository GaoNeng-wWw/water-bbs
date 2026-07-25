import Joi from 'joi';

export type RedisConfig = {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  db: number;
};
export const redisSchema = Joi.object<RedisConfig>({
  host: Joi.string(),
  port: Joi.number().default(6379),
  user: Joi.string(),
  pass: Joi.string(),
  db: Joi.number(),
});
