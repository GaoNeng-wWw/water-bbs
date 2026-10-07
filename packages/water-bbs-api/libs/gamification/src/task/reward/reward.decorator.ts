import { DomainError } from '@app/shared';
import { EntityManager } from '@mikro-orm/sqlite';
import { applyDecorators } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { Result } from 'neverthrow';

export type RewardContext = {
  write: EntityManager;
  read: EntityManager;
};
export interface IReward {
  execute(
    param: Record<string, any>,
    ctx: RewardContext,
  ): Promise<Result<void, DomainError>>;
}

export type RewardProp = {
  name: string;
};

export const RewardMetaData = DiscoveryService.createDecorator<RewardProp>();

export const Reward = (props: RewardProp) => {
  return applyDecorators(RewardMetaData(props));
};
