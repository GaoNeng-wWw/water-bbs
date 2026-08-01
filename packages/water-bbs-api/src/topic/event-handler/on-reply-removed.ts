import { IEventHandler } from '@nestjs/cqrs';
import { ReplyRemoved } from '../events/reply-removed.event';
import { RedisService } from '@liaoliaots/nestjs-redis';

export class OnReplyRemoved implements IEventHandler<ReplyRemoved> {
  constructor(private readonly redisSrv: RedisService) {}
  async handle(event: ReplyRemoved) {
    const redis = this.redisSrv.getOrThrow();
    await redis.decr(`topic:${event.topicId}:replyTotal`);
  }
}
