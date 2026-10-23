import { InfraError } from '@app/shared';
import { EntityManager } from '@mikro-orm/core';
import { DiscoveryService } from '@nestjs/core';
import { Result } from 'neverthrow';
import z from 'zod';

export type Context = {
  read: EntityManager;
  write: EntityManager;
};

export interface IReward<Schema extends z.ZodType, ReturnType> {
  execute(
    param: z.infer<Schema>,
    ctx: Context,
  ): Promise<Result<ReturnType, InfraError>>;
}

export type RewardMetadata = {
  name: string;
  schema: z.ZodType;
};

export const Reward = DiscoveryService.createDecorator<RewardMetadata>();
