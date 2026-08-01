import Joi from 'joi';

export const FeatureSchema = Joi.object({
  verificationCodeTTL: Joi.number().default(5),
  verificationCodeOnRegister: Joi.boolean().default(false),
});

export type Feature = {
  /**
   * @description minutes
   */
  verificationCodeTTL: number;
  verificationCodeOnRegister: boolean;
};
