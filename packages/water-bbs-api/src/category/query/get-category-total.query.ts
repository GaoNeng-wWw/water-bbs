import { DomainError } from '@app/shared';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { EntityRepository } from '@mikro-orm/sqlite';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';
import { Category } from '../entities';
import { InjectRepository } from '@mikro-orm/nestjs';

export class GetCategoryTotalQuery extends Query<Result<number, DomainError>> {
  constructor() {
    super();
  }
}

@QueryHandler(GetCategoryTotalQuery)
export class GetCategoryTotalService implements IQueryHandler<GetCategoryTotalQuery> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly redisService: RedisService,
  ) {}
  async execute(): Promise<Result<number, DomainError>> {
    const redis = this.redisService.getOrThrow();
    const rawTotale = await redis.get('category:total');
    if (!rawTotale) {
      const total = await this.categoryRepository.count();
      await redis.set('category:total', total);
      return ok(total);
    }
    return ok(Number(rawTotale));
  }
}
