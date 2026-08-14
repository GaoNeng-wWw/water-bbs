import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CategoryCreated } from '../events';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Category } from '../entities';
import { EntityRepository } from '@mikro-orm/core';
import { ok } from 'neverthrow';

@EventsHandler(CategoryCreated)
export class OnCategoryCreated implements IEventHandler<CategoryCreated> {
  constructor(
    private redisSrv: RedisService,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
  ) {}
  async handle() {
    const redis = this.redisSrv.getOrThrow();
    const rawTotal = await redis.get('category:total');
    if (rawTotal) {
      return ok(Number(rawTotal));
    }
    const total = await this.categoryRepository.count();
    await redis.set('category:total', total);
    return ok(total);
  }
}
