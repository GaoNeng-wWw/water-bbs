import Joi from 'joi';

export type SingleNode = {
  host: string;
  port: number;
};
export type Cluster = {
  type: 'cluster';
  nodes: SingleNode[];
};
export type Single = {
  type: 'single';
} & SingleNode;

export type RedisConfigure = Single | Cluster;

const singleNodeSchema = Joi.object({
  host: Joi.string().required(),
  port: Joi.number().integer().optional(),
});

export const redisConfigSchema = Joi.object({
  type: Joi.string().valid('single', 'cluster').required(),
  host: Joi.string().when('type', {
    is: 'single',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  port: Joi.number().integer().when('type', {
    is: 'single',
    then: Joi.optional(),
    otherwise: Joi.forbidden(),
  }),

  nodes: Joi.array().items(singleNodeSchema).min(1).when('type', {
    is: 'cluster',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
}).required();
