import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, ModuleRef, Reflector } from '@nestjs/core';
import { isNullish } from 'radashi';
import {
  IRewardHandler,
  RewardHandlerKey,
  RewardOptions,
} from './reward.types';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Reward } from 'water-bbs-migration';
import {
  DomainError,
  err,
  isNone,
  none,
  ok,
  PersistenceError,
  some,
} from 'water-bbs-shared';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ZodType } from 'zod';

export type Handler = {
  code: string;
  description?: string | undefined;
  label: string;
  schema: ZodType;
  handler: IRewardHandler<ZodType>;
};

@Injectable()
export class RewardRegistry implements OnApplicationBootstrap {
  private handlers: Handler[];
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
  getId(code: string) {
    return this.reward.find({ code }, { fields: ['id'], cache: true });
  }
  getEntity(code: string) {
    return this.reward
      .findOne({ code }, { cache: true })
      .then((value) => (value ? ok(some(value)) : ok(none)))
      .catch((reason) => {
        const perr = new PersistenceError(reason);
        return err(new DomainError(perr.message, perr));
      });
  }
  getRewardHandlers() {
    return ok(this.handlers);
  }
  applyReward(
    reward: Reward,
    userId: string,
    externalParam: Record<string, any> = {},
  ) {
    const handler = this.getRewardHandler(reward.code);
    if (isNone(handler)) {
      return err(
        new DomainError('CAN_NOT_FOUND_REWARD_HANDLER', null, {
          code: reward.code,
          id: reward.id,
        }),
      );
    }
    return handler.value.handler.handle({ userId }, externalParam);
  }
  async onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();
    const metaTypes = providers
      .filter(
        (p) => p.metatype && this.reflector.get(RewardHandlerKey, p.metatype),
      )
      .map((provider) => provider.metatype)
      .filter((mt) => !isNullish(mt));
    const handlers = metaTypes.map((mt) => {
      const rewardMetadata = this.reflector.get<RewardOptions<ZodType>>(
        RewardHandlerKey,
        mt,
      );
      return {
        handler: this.moduleRef.get<IRewardHandler<ZodType>>(mt, {
          strict: false,
        }),
        ...rewardMetadata,
      };
    });
    this.handlers = handlers;
    await this.em.transactional(async (em) => {
      const rewards = this.handlers.map((h) => {
        return em.create(Reward, {
          code: h.code,
          label: h.label,
          description: h.description ?? '',
          createdAt: new Date(),
          schema: h.schema,
        });
      });
      em.persist(rewards);
      await em.flush();
    });
  }
}
