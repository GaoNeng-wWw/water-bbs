import { applyDecorators, SetMetadata } from '@nestjs/common';
import z, { ZodType } from 'zod';

export type RewardHandlerParam = { userId: string };

export interface IRewardHandler<Schema extends ZodType> {
  code: string;
  description: string;
  label: string;
  schema: Schema;
  handle(
    param: RewardHandlerParam,
    dynamicParam: z.infer<Schema>,
  ): Promise<void>;
}

export const RewardHandlerKey = Symbol('RewardHandlerKey');
export const RewardHandler = (code?: string) =>
  applyDecorators(SetMetadata(RewardHandlerKey, code));
