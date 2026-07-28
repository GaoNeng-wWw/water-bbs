import Joi from "joi";

export type MailConfigure = {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
};

export const MailAuthSchema = Joi.object({
  user: Joi.string(),
  pass: Joi.string(),
});

export const MailSchema = Joi.object({
  host: Joi.string(),
  port: Joi.number(),
  auth: MailAuthSchema,
  from: Joi.string(),
});
