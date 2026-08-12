import { RedisService } from '@liaoliaots/nestjs-redis';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TopicRemoved } from '../../topic';

@EventsHandler(TopicRemoved)
export class OnTopicRemoved implements IEventHandler<TopicRemoved> {
  constructor(private readonly redis: RedisService) {}
  async handle({ authorId }: TopicRemoved) {
    const redis = this.redis.getOrThrow();
    await redis.decr(`user:${authorId}:topic:total`);
  }
}
