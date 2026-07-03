import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, ModuleRef, Reflector } from '@nestjs/core';
import { isNullish } from 'radashi';
import { IRewardHandler, RewardHandlerKey } from './reward.types';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Reward } from 'water-bbs-migration';
import { DomainError, err, isNone, none, ok, some } from 'water-bbs-shared';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class RewardRegistry implements OnApplicationBootstrap {
  private handlers: IRewardHandler[];
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
    private readonly discoveryService: DiscoveryService,
    @InjectRepository(Reward)
    private readonly reward: EntityRepository<Reward>,
    private readonly em: EntityManager,
  ) {}
  getRewardHandler(code: string) {
    const r = this.handlers.filter((h) => h.code === code)[0];
    return r ? some(r) : none;
  }
  getRewardHandlers() {
    return ok(this.handlers);
  }
  applyReward(reward: Reward, userId: string) {
    const handler = this.getRewardHandler(reward.code);
    if (isNone(handler)) {
      return err(
        new DomainError('CAN_NOT_FOUND_REWARD_HANDLER', null, {
          code: reward.code,
          id: reward.id,
        }),
      );
    }
    return handler.value.handle({ userId });
  }
  async onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();
    const metaTypes = providers
      .filter(
        (p) => p.metatype && this.reflector.get(RewardHandlerKey, p.metatype),
      )
      .map((provider) => provider.metatype)
      .filter((mt) => !isNullish(mt));
    const handlers = metaTypes.map((mt) =>
      this.moduleRef.get<IRewardHandler>(mt, { strict: false }),
    );
    await this.em.transactional(async (em) => {
      for (const handler of handlers) {
        const reward = await this.reward.findOne({ code: handler.code });
        if (reward) {
          continue;
        }
        const r = Reward.create({
          code: handler.code,
          label: handler.label,
          description: handler.description,
        });
        await this.reward.upsert(r, { em });
      }
    });
    this.handlers = handlers;
  }
}
