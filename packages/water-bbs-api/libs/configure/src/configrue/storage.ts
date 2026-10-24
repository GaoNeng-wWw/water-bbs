import Joi from 'joi';

export interface DiskStorage {
  kind: 'disk';
  path: string;
}
export interface Memory {
  kind: 'memory';
}
export type Storage = DiskStorage | Memory;

export const StorageSchema = Joi.alternatives<Storage>()
  .try(
    Joi.object({
      kind: Joi.string().valid('disk').required(),
      path: Joi.string().required(),
    }),
    Joi.object({
      kind: Joi.string().valid('memory').required(),
    }),
  )
  .match('one');
