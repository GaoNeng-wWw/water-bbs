import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { IReward, RewardMetaData, RewardProp } from './reward.decorator';
import { EntityManager } from '@mikro-orm/sqlite';
import { err } from 'neverthrow';
import { UnknownReward } from '../error/unknown-reward';

@Injectable()
export class RewardDiscoverService implements OnApplicationBootstrap {
  private readonly logger = new Logger('RewardDiscover');
  private readonly map = new Map<string, IReward>();
  constructor(
    private readonly discoverService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly em: EntityManager,
  ) {}
  onApplicationBootstrap() {
    this.discoverService
      .getProviders({
        metadataKey: RewardMetaData.KEY,
      })
      .forEach((value) => {
        const def = this.reflector.get<RewardProp>(
          RewardMetaData.KEY,
          value.metatype!,
        );
        this.logger.log(`SuccessFully registered ${def.name} reward`);
        this.map.set(def.name, value.instance);
      });
  }
  call(name: string, data: Record<string, any>) {
    const handler = this.map.get(name);
    if (!handler) {
      return err(new UnknownReward(name));
    }
    const write = this.em.fork();
    const read = this.em.fork();
    return handler.execute(data, { read, write });
  }
}
