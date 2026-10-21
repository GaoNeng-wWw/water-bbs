import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { IReward, Reward, RewardMetadata } from './reward.decorator';
import { err } from 'neverthrow';
import { EntityManager } from '@mikro-orm/core';
import { RewardNotFound } from '../error';
import { RewardParamError } from '../error/reward-param-error';
import { InfraError } from '@app/shared';

@Injectable()
export class RewardService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RewardService.name);
  private readonly metadataMap: Map<string, RewardMetadata> = new Map();
  private readonly instanceMap: Map<string, IReward<any, any>> = new Map();
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly em: EntityManager,
  ) {}
  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders({
      metadataKey: Reward.KEY,
    });
    for (const provider of providers) {
      const metadata = this.discoveryService.getMetadataByDecorator(
        Reward,
        provider,
      );
      if (!metadata) {
        continue;
      }
      this.metadataMap.set(metadata.name, metadata);
      this.instanceMap.set(metadata.name, provider.instance);
      this.logger.log(`Reward ${metadata.name} registered`);
    }
  }
  async call(name: string, param: Record<string, any>) {
    const metadata = this.metadataMap.get(name);
    if (!metadata) {
      return err(new RewardNotFound(name));
    }
    const { data, success, error } = metadata.schema.safeParse(param);
    if (!success) {
      return err(new RewardParamError(error));
    }
    const instance = this.instanceMap.get(name);
    if (!instance) {
      return err(new RewardNotFound(name));
    }
    const write = this.em.fork();
    const rewardExecuteResult = write.transactional(async (em) => {
      const result = await instance.execute(data, { read: em, write: em });
      if (result.isErr()) {
        throw result.error;
      }
      return result;
    });
    return rewardExecuteResult
      .then((result) => {
        return result;
      })
      .catch((reason) => {
        return err(new InfraError(reason));
      });
  }
}