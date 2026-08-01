import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReplyCreated } from '../events';
import { RedisService } from '@liaoliaots/nestjs-redis';

@EventsHandler(ReplyCreated)
export class OnReplyCreated implements IEventHandler<ReplyCreated> {
  constructor(private readonly redisSrv: RedisService) {}
  async handle(event: ReplyCreated) {
    const redis = this.redisSrv.getOrThrow();
    await redis.incr(`topic:${event.topicId}:replyTotal`);
  }
}
