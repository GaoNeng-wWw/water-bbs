import Joi from 'joi';

export const FeatureSchema = Joi.object({
  verificationCodeTTL: Joi.number().default(5),
  verificationCodeOnRegister: Joi.boolean().default(false),
  proposalTTL: Joi.number().default(7 * 24 * 60 * 60),
});

export type Feature = {
  /**
   * @description minutes
   */
  verificationCodeTTL: number;
  verificationCodeOnRegister: boolean;
  /**
   * @description seconds
   */
  proposalTTL: number;
};
