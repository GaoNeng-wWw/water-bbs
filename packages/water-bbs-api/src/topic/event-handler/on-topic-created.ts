import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TopicCreated } from '../events';
import { RedisService } from '@liaoliaots/nestjs-redis';

@EventsHandler(TopicCreated)
export class OnTopicCreated implements IEventHandler<TopicCreated> {
  constructor(private readonly redisSrv: RedisService) {}
  async handle(event: TopicCreated) {
    const redis = this.redisSrv.getOrThrow();
    await redis.incr(`topic:${event.topicId}:replyTotal`);
    await redis.incr(`category:${event.categoryId}:topic-total`);
    await redis.incr(`topic-total`);
  }
}
