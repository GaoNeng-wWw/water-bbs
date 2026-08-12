import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TopicRemoved } from '../events';
import { RedisService } from '@liaoliaots/nestjs-redis';

@EventsHandler(TopicRemoved)
export class OnTopicRemoved implements IEventHandler<TopicRemoved> {
  constructor(private readonly redisSrv: RedisService) {}
  async handle(event: TopicRemoved) {
    const redis = this.redisSrv.getOrThrow();
    await redis.del(`topic:${event.topicId}:replyTotal`);
    await redis.decr(`topic-total`);
  }
}
