import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { AccountId } from 'src/auth';
import { TaskID } from '../infra';
import { TaskProgress } from './dto/task-progress.dto';

@Injectable()
export class TaskProgressCacheService {
  private readonly redis: Redis;
  constructor(redisSrv: RedisService) {
    this.redis = redisSrv.getOrThrow();
  }
  miss(accountID: AccountId, taskID: TaskID) {
    return this.redis.del(`task:progress:${accountID}:${taskID}`);
  }
  put(accountID: AccountId, taskID: TaskID, progress: TaskProgress) {
    return this.redis.set(
      `task:progress:${accountID}:${taskID}`,
      JSON.stringify(progress),
      // todo: 从配置中读取过期时间
      'EX',
      60,
    );
  }
  get(accountID: AccountId, taskID: TaskID) {
    return this.redis
      .get(`task:progress:${accountID}:${taskID}`)
      .then((progress) => JSON.parse(progress ?? '[]') as TaskProgress);
  }
}
