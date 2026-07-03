import { applyDecorators, SetMetadata } from '@nestjs/common';

export type RewardHandlerParam = { userId: string };

export interface IRewardHandler {
  code: string;
  description: string;
  label: string;
  handle(param: RewardHandlerParam): Promise<void>;
}

export const RewardHandlerKey = Symbol('RewardHandlerKey');
export const RewardHandler = (code?: string) =>
  applyDecorators(SetMetadata(RewardHandlerKey, code));
