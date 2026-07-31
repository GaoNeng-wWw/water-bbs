import Joi from 'joi';

export type TokenConfigure = {
  accessTokenTTL: number;
  refreshTokenTTL: number;
  publicKey: string;
  privateKey: string;
  secret: string;
};

export const tokenSchema = Joi.object({
  accessTokenTTL: Joi.number(),
  refreshTokenTTL: Joi.number(),
  publicKey: Joi.string(),
  privateKey: Joi.string(),
  secret: Joi.string(),
});
