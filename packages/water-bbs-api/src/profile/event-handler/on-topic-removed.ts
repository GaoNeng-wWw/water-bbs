import { RedisService } from '@liaoliaots/nestjs-redis';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TopicCreated, TopicRemoved } from '../../topic';

@EventsHandler(TopicRemoved)
export class OnTopicRemoved implements IEventHandler<TopicRemoved> {
  constructor(private readonly redis: RedisService) {}
  async handle({ authorId }: TopicCreated) {
    const redis = this.redis.getOrThrow();
    await redis.decr(`user:${authorId}:topic:total`);
  }
}
