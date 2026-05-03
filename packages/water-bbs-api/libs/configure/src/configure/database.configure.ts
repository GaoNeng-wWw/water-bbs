import Joi from 'joi';

export type DatabaseConfigure = {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};

export const databaseConfigValidatorSchema =
  Joi.object<DatabaseConfigure>().keys({
    host: Joi.string().required(),
    port: Joi.number().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    dbName: Joi.string().required(),
  });
