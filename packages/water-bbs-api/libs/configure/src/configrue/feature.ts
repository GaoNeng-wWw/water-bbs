import Joi from "joi";

export const FeatureSchema = Joi.object({
  verificationCodeTTL: Joi.number().default(5),
});

export type Feature = {
  /**
   * @description minutes
   */
  verificationCodeTTL: number;
}