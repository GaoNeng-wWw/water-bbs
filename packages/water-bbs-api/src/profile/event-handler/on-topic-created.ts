import { RedisService } from '@liaoliaots/nestjs-redis';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TopicCreated } from '../../topic';

@EventsHandler(TopicCreated)
export class OnTopicCreated implements IEventHandler<TopicCreated> {
  constructor(private readonly redis: RedisService) {}
  async handle({ authorId }: TopicCreated) {
    const redis = this.redis.getOrThrow();
    await redis.incr(`user:${authorId}:topic:total`);
  }
}
