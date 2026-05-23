import Joi from 'joi';

export type LocalStorage = {
  type: 'local';
  path: string;
};

export type Storage = LocalStorage;

export const storageConfigValidatorSchema = Joi.object({
  type: Joi.string().valid('local').required(),
  path: Joi.string(),
});
