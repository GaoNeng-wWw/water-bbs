import Joi from 'joi';

export interface Database {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  db: string;
}

export const databaseSchema = Joi.object<Database>({
  host: Joi.string(),
  port: Joi.number(),
  user: Joi.string(),
  pass: Joi.string(),
  db: Joi.string().required(),
});
