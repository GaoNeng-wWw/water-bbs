import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import z, { ZodType } from 'zod';

export type RewardHandlerParam = { userId: string };

export type RewardOptions<Schema> = {
  code: string;
  description?: string;
  label: string;
  schema: Schema;
};

export interface IRewardHandler<Schema extends ZodType> {
  handle(
    param: RewardHandlerParam,
    dynamicParam: z.infer<Schema>,
  ): Promise<void>;
}

export const RewardHandlerKey = Symbol('RewardHandlerKey');
export const RewardHandler = (opts: RewardOptions<ZodType>) =>
  applyDecorators(Injectable, SetMetadata(RewardHandlerKey, opts));
