import Joi from "joi";

export type TokenConfigure = {
  accessTokenTTL: number;
  refreshTokenTTL: number;
  publicKey: string;
  privateKey: string;
};

export const tokenSchema = Joi.object({
  accessTokenTTL: Joi.number(),
  refreshTokenTTL: Joi.number(),
  publicKey: Joi.string(),
  privateKey: Joi.string(),
});
