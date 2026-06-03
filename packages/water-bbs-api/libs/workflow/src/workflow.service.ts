import { RedisService } from '@liaoliaots/nestjs-redis';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Action } from 'water-bbs-migration';
import z, { ZodType } from 'zod';

@Injectable()
export class WorkflowService {
  private redis: Redis;
  constructor(
    @InjectRepository(Action)
    private readonly actionRepo: EntityRepository<Action>,
    redisService: RedisService,
  ) {
    this.redis = redisService.getOrThrow();
  }

  async save(name: string, schema: ZodType) {
    if (await this.redis.get(`action:${name}`)) {
      return;
    }

    await this.redis.set(`action:${name}`, '1', 'EX', 60);

    try {
      const action = await this.actionRepo.find({ name });
      if (action) {
        return;
      }
    } catch {
      return;
    }
    const plainSchemaObject = z.toJSONSchema(schema);
    const action = Action.create(name, plainSchemaObject);
    try {
      await this.actionRepo.insert(action);
    } catch {
      return;
    }
  }
}
